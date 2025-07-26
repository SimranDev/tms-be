import {
  PrismaClient,
  Customer,
  Container,
  Driver,
  Vehicle,
  User,
  Location,
  JobStatus,
} from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedJobs(
  prisma: PrismaClient,
  customers: Customer[],
  containers: Container[],
  drivers: Driver[],
  vehicles: Vehicle[],
  users: User[],
  locations: Location[],
): Promise<any[]> {
  console.log('📋 Creating 16 jobs with relations...');

  const jobStatuses = [
    JobStatus.Booked,
    JobStatus.Assigned,
    JobStatus.InProgress,
    JobStatus.Completed,
  ];

  const freightDescriptions = [
    'Electronic equipment and components',
    'Automotive parts and accessories',
    'Food and beverage products',
    'Textiles and clothing materials',
    'Construction materials and tools',
    'Medical supplies and equipment',
    'Furniture and home appliances',
    'Paper products and packaging',
    'Industrial machinery parts',
    'Chemical products (non-hazardous)',
    'Consumer goods and retail items',
    'Agricultural products and supplies',
    'Mining equipment and supplies',
    'Pharmaceutical products',
    'IT and telecommunications equipment',
    'Sporting goods and recreation equipment',
  ];

  const jobs: any[] = [];
  const simDriver = drivers.find((d) => d.email === 'sim.driver@tms.com');

  for (let i = 0; i < 16; i++) {
    // Select random related entities
    const randomCustomer = faker.helpers.arrayElement(customers);
    const randomContainer = faker.helpers.arrayElement(containers);

    // Assign first 8 jobs to Sim driver, rest to random drivers
    const assignedDriver =
      i < 8 && simDriver ? simDriver : faker.helpers.arrayElement(drivers);

    const randomVehicle = faker.helpers.arrayElement(vehicles);
    const randomUser = faker.helpers.arrayElement(users);
    const randomStatus = faker.helpers.arrayElement(jobStatuses);

    // Generate realistic dates
    const baseDate = faker.date.between({
      from: new Date(new Date().setDate(new Date().getDate() - 10)), // 10 days ago
      to: new Date(new Date().setDate(new Date().getDate() + 20)), // 20 days from now
    });

    const scheduledPickup = new Date(baseDate);
    const scheduledDelivery = new Date(scheduledPickup);
    scheduledDelivery.setHours(
      scheduledDelivery.getHours() + faker.number.int({ min: 6, max: 96 }),
    );

    // Generate actual dates based on job status
    let actualPickup: Date | null = null;
    let actualDelivery: Date | null = null;

    if (
      randomStatus === JobStatus.InProgress ||
      randomStatus === JobStatus.Completed
    ) {
      actualPickup = faker.date.between({
        from: scheduledPickup,
        to: new Date(scheduledPickup.getTime() + 8 * 60 * 60 * 1000),
      });
    }

    if (randomStatus === JobStatus.Completed) {
      const deliveryStart = actualPickup || scheduledDelivery;
      actualDelivery = faker.date.between({
        from: deliveryStart,
        to: new Date(deliveryStart.getTime() + 24 * 60 * 60 * 1000),
      });
    }

    // Select random pickup and delivery locations
    const pickupLocationRecord = faker.helpers.arrayElement(locations);
    const deliveryLocationRecord = faker.helpers.arrayElement(
      locations.filter((loc) => loc.id !== pickupLocationRecord.id),
    );

    const job = await prisma.job.create({
      data: {
        customerId: randomCustomer.id,
        containerId: randomContainer.id,
        driverId: assignedDriver.id,
        vehicleId: randomVehicle.id,
        status: randomStatus,
        pickupLocationId: pickupLocationRecord.id,
        deliveryLocationId: deliveryLocationRecord.id,
        scheduledPickup,
        scheduledDelivery,
        actualPickup,
        actualDelivery,
        freightDescription: faker.helpers.arrayElement(freightDescriptions),
        instructions: faker.datatype.boolean(0.3)
          ? faker.lorem.sentences(1)
          : null,
        customerReference: faker.datatype.boolean(0.6)
          ? faker.string.alphanumeric({ length: 8, casing: 'upper' })
          : null,
        createdByUserId: randomUser.id,
      },
    });
    jobs.push(job);
  }

  console.log(`✅ Created ${jobs.length} jobs`);
  return jobs;
}
