import {
  PrismaClient,
  VehicleType,
  ContainerType,
  ContainerSize,
  ContainerStatus,
} from '../generated/prisma';
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
  const drivers: any[] = [];

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

  const vehicles: any[] = [];

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

  const containers: any[] = [];

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

  // Display summary
  console.log('\n📊 Seed Summary:');
  console.log('================');
  console.log(`👥 Users: ${users.length}`);
  console.log(`🚛 Drivers: ${drivers.length}`);
  console.log(`🚗 Vehicles: ${vehicles.length}`);
  console.log(`📦 Containers: ${containers.length}`);

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
