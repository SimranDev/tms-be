import {
  PrismaClient,
  VehicleType,
  ContainerType,
  ContainerSize,
  ContainerStatus,
  JobStatus,
  Customer,
  Container,
  Driver,
  Vehicle,
} from '@prisma/client';

import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Pre-hash common passwords for better performance
  console.log('🔐 Hashing passwords...');
  const hashedPasswords = {
    user: await bcrypt.hash('user123', 10),
    driver: await bcrypt.hash('driver123', 10),
    admin: await bcrypt.hash('admin123', 10),
  };

  // Clear existing data (optional - remove if you want to keep existing data)
  console.log('🧹 Cleaning existing data...');
  await prisma.job.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.container.deleteMany();

  // Create 3 Users
  console.log('👥 Creating 3 users...');
  const users = await Promise.all([
    prisma.user.create({
      data: {
        firstname: 'Simran',
        lastname: 'Singh',
        email: 'sim.admin@tms.com',
        password: hashedPasswords.admin,
      },
    }),
    prisma.user.create({
      data: {
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        email: faker.internet.email(),
        password: hashedPasswords.user,
      },
    }),
    prisma.user.create({
      data: {
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        email: faker.internet.email(),
        password: hashedPasswords.user,
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create 15 Drivers
  console.log('🚛 Creating 15 drivers...');
  const drivers: Driver[] = [];

  for (let i = 0; i < 15; i++) {
    const driver = await prisma.driver.create({
      data: {
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number({
          style: 'international',
        }), // Generate phone number
        password: hashedPasswords.driver,
        licenseNumber: faker.string.alphanumeric({
          length: 8,
          casing: 'upper',
        }),
        licenseExpiryDate: faker.date.between({
          from: new Date(new Date().setFullYear(new Date().getFullYear() - 1)), // last year
          to: new Date(new Date().setFullYear(new Date().getFullYear() + 3)), // License expires within 3 years
        }),
        isActive: faker.datatype.boolean(0.9), // 90% chance of being active
      },
    });
    drivers.push(driver);
  }

  console.log(`✅ Created ${drivers.length} drivers`);

  // Create 12 Vehicles
  console.log('🚗 Creating 12 vehicles...');
  const vehicleTypes = [
    VehicleType.Tractor,
    VehicleType.Trailer,
    VehicleType.Van,
    VehicleType.Flatbed,
  ];

  // Truck manufacturers and models for commercial vehicles
  const truckManufacturers = [
    'Kenworth',
    'Peterbilt',
    'Freightliner',
    'Volvo',
    'Mack',
    'International',
    'Western Star',
    'Ford',
    'Chevrolet',
    'Isuzu',
  ];

  const truckModels = {
    Tractor: ['T680', 'T880', 'W900', '579', 'VNL', 'Anthem', '4700', '5700'],
    Trailer: ['Dry Van', 'Flatbed', 'Reefer', 'Tanker', 'Lowboy', 'Container'],
    Van: ['Transit', 'Sprinter', 'ProMaster', 'Express', 'Savana', 'NV200'],
    Flatbed: ['Steel Deck', 'Aluminum Deck', 'Drop Deck', 'Step Deck', 'RGN'],
  };

  const vehicles: Vehicle[] = [];

  for (let i = 0; i < 12; i++) {
    const vehicleType = faker.helpers.arrayElement(vehicleTypes);
    const manufacturer = faker.helpers.arrayElement(truckManufacturers);
    const model = faker.helpers.arrayElement(truckModels[vehicleType]);

    const vehicle = await prisma.vehicle.create({
      data: {
        name: `${manufacturer} ${model}`,
        rego: faker.vehicle.vin().substring(0, 8).toUpperCase(), // Generate registration number
        vinNumber: faker.vehicle.vin(),
        type: vehicleType,
        capacityKg: faker.number.int({ min: 1000, max: 40000 }), // Capacity between 1-40 tons
        registrationExpiry: faker.date.between({
          from: new Date(),
          to: new Date(new Date().setFullYear(new Date().getFullYear() + 2)), // Expires within 2 years
        }),
        insuranceExpiry: faker.date.between({
          from: new Date(),
          to: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Expires within 1 year
        }),
        isActive: faker.datatype.boolean(0.95), // 90% chance of being active
      },
    });
    vehicles.push(vehicle);
  }

  console.log(`✅ Created ${vehicles.length} vehicles`);

  // Create 14 Containers
  console.log('📦 Creating 14 containers...');
  const containerTypes = [
    ContainerType.Dry,
    ContainerType.Reefer,
    ContainerType.OpenTop,
  ];

  const containerSizes = [
    ContainerSize.S20ft,
    ContainerSize.S40ft,
    ContainerSize.S45ft,
  ];

  const containerStatuses = [
    ContainerStatus.InYard,
    ContainerStatus.InTransit,
    ContainerStatus.WithCustomer,
  ];

  const containers: Container[] = [];

  for (let i = 0; i < 14; i++) {
    const container = await prisma.container.create({
      data: {
        containerNumber: `CON${faker.string.alphanumeric({
          length: 7,
          casing: 'upper',
        })}`, // Generate container number like CON1234567
        type: faker.helpers.arrayElement(containerTypes),
        size: faker.helpers.arrayElement(containerSizes),
        status: faker.helpers.arrayElement(containerStatuses),
        notes: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : null, // 30% chance of having notes
      },
    });
    containers.push(container);
  }

  console.log(`✅ Created ${containers.length} containers`);

  // Create 5 Customers (Australian-based)
  console.log('🏢 Creating 5 customers with Australian addresses...');
  const australianCities = [
    { city: 'Sydney', state: 'NSW', postcode: '2000' },
    { city: 'Melbourne', state: 'VIC', postcode: '3000' },
    { city: 'Brisbane', state: 'QLD', postcode: '4000' },
    { city: 'Perth', state: 'WA', postcode: '6000' },
    { city: 'Adelaide', state: 'SA', postcode: '5000' },
  ];

  const customers: Customer[] = [];

  for (let i = 0; i < 5; i++) {
    const cityInfo = australianCities[i];
    const streetNumber = faker.number.int({ min: 1, max: 999 });
    const streetName = faker.location.street();

    const customer = await prisma.customer.create({
      data: {
        companyName: faker.company.name(),
        contactPerson: `${faker.person.firstName()} ${faker.person.lastName()}`,
        email: faker.internet.email(),
        phoneNumber: `+61 ${faker.number.int({ min: 2, max: 9 })}${faker.number.int({ min: 1000, max: 9999 })}${faker.number.int({ min: 1000, max: 9999 })}`,
        address: `${streetNumber} ${streetName}, ${cityInfo.city} ${cityInfo.state} ${cityInfo.postcode}, Australia`,
      },
    });
    customers.push(customer);
  }

  console.log(`✅ Created ${customers.length} customers`);

  // Create 16 Jobs with Relations
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

  // Australian cities for pickup/delivery addresses
  const australianLocations = [
    { city: 'Sydney', state: 'NSW' },
    { city: 'Melbourne', state: 'VIC' },
    { city: 'Brisbane', state: 'QLD' },
    { city: 'Perth', state: 'WA' },
    { city: 'Adelaide', state: 'SA' },
    { city: 'Newcastle', state: 'NSW' },
    { city: 'Gold Coast', state: 'QLD' },
    { city: 'Canberra', state: 'ACT' },
    { city: 'Wollongong', state: 'NSW' },
    { city: 'Geelong', state: 'VIC' },
    { city: 'Townsville', state: 'QLD' },
    { city: 'Cairns', state: 'QLD' },
  ];

  const jobs: any[] = [];

  for (let i = 0; i < 16; i++) {
    // Select random related entities

    const randomCustomer = faker.helpers.arrayElement(customers);
    const randomContainer = faker.helpers.arrayElement(containers);
    const randomDriver = faker.helpers.arrayElement(drivers);
    const randomVehicle = faker.helpers.arrayElement(vehicles);
    const randomUser = faker.helpers.arrayElement(users);
    const randomStatus = faker.helpers.arrayElement(jobStatuses);

    // Generate realistic pickup and delivery addresses in Australia
    const pickupLocation = faker.helpers.arrayElement(australianLocations);
    const deliveryLocation = faker.helpers.arrayElement(
      australianLocations.filter((loc) => loc.city !== pickupLocation.city),
    );

    const pickupStreetNumber = faker.number.int({ min: 1, max: 999 });
    const pickupStreetName = faker.location.street();
    const pickupPostcode = faker.number.int({ min: 1000, max: 9999 });

    const deliveryStreetNumber = faker.number.int({ min: 1, max: 999 });
    const deliveryStreetName = faker.location.street();
    const deliveryPostcode = faker.number.int({ min: 1000, max: 9999 });

    // Generate realistic dates
    const baseDate = faker.date.between({
      from: new Date(new Date().setDate(new Date().getDate() - 10)), // 10 days ago
      to: new Date(new Date().setDate(new Date().getDate() + 20)), // 20 days from now
    });

    const scheduledPickup = new Date(baseDate);

    const scheduledDelivery = new Date(scheduledPickup);
    scheduledDelivery.setHours(
      scheduledDelivery.getHours() + faker.number.int({ min: 6, max: 96 }),
    ); // 6-96 hours after pickup (1-4 days for Australian interstate)

    // Generate actual dates based on job status
    let actualPickup: Date | null = null;
    let actualDelivery: Date | null = null;

    if (
      randomStatus === JobStatus.InProgress ||
      randomStatus === JobStatus.Completed
    ) {
      // For in-progress or completed jobs, set actual pickup
      actualPickup = faker.date.between({
        from: scheduledPickup,
        to: new Date(scheduledPickup.getTime() + 8 * 60 * 60 * 1000), // Within 8 hours of scheduled
      });
    }

    if (randomStatus === JobStatus.Completed) {
      // For completed jobs, set actual delivery
      const deliveryStart = actualPickup || scheduledDelivery;
      actualDelivery = faker.date.between({
        from: deliveryStart,
        to: new Date(deliveryStart.getTime() + 24 * 60 * 60 * 1000), // Within 24 hours of actual pickup or scheduled delivery
      });
    }

    const job = await prisma.job.create({
      data: {
        customerId: randomCustomer.id,
        containerId: randomContainer.id,
        driverId: randomDriver.id,
        vehicleId: randomVehicle.id,
        status: randomStatus,
        pickupAddress: `${pickupStreetNumber} ${pickupStreetName}, ${pickupLocation.city} ${pickupLocation.state} ${pickupPostcode}, Australia`,
        deliveryAddress: `${deliveryStreetNumber} ${deliveryStreetName}, ${deliveryLocation.city} ${deliveryLocation.state} ${deliveryPostcode}, Australia`,
        scheduledPickup,
        scheduledDelivery,
        actualPickup,
        actualDelivery,
        freightDescription: faker.helpers.arrayElement(freightDescriptions),
        notes: faker.datatype.boolean(0.4) ? faker.lorem.sentences(2) : null, // 40% chance of notes
        createdByUserId: randomUser.id,
      },
    });
    jobs.push(job);
  }

  console.log(`✅ Created ${jobs.length} jobs`);

  // Display summary
  console.log('\n📊 Seed Summary:');
  console.log('================');
  console.log(`👥 Users: ${users.length}`);
  console.log(`🏢 Customers: ${customers.length}`);
  console.log(`🚛 Drivers: ${drivers.length}`);
  console.log(`🚗 Vehicles: ${vehicles.length}`);
  console.log(`📦 Containers: ${containers.length}`);
  console.log(`📋 Jobs: ${jobs.length}`);

  console.log('\n🔑 Login Credentials:');
  console.log('====================');
  console.log('Admin User:');
  console.log('  Email: admin@tms.com');
  console.log('  Password: admin123');
  console.log('\nOther Users & All Drivers:');
  console.log('  Password: user123 (for users)');
  console.log('  Password: driver123 (for drivers)');

  console.log('\n🌱 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
