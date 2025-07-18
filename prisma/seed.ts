import { PrismaClient } from '../generated/prisma';
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

  // Display summary
  console.log('\n📊 Seed Summary:');
  console.log('================');
  console.log(`👥 Users: ${users.length}`);
  console.log(`🚛 Drivers: ${drivers.length}`);

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
