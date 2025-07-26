import { PrismaClient, Driver } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

export async function seedDrivers(prisma: PrismaClient): Promise<Driver[]> {
  console.log('🚛 Creating 16 drivers...');

  const hashedPassword = await bcrypt.hash('driver123', 10);
  const drivers: Driver[] = [];

  // Create the specific driver for Sim first
  const simDriver = await prisma.driver.create({
    data: {
      firstname: 'Sim',
      lastname: 'Driver',
      email: 'sim.driver@tms.com',
      phoneNumber: '+61 412 345 678',
      password: hashedPassword,
      licenseNumber: 'SIMDRV01',
      licenseExpiryDate: new Date(
        new Date().setFullYear(new Date().getFullYear() + 2),
      ), // Expires in 2 years
      isActive: true,
    },
  });
  drivers.push(simDriver);

  // Create 15 additional random drivers
  for (let i = 0; i < 15; i++) {
    const driver = await prisma.driver.create({
      data: {
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number({
          style: 'international',
        }),
        password: hashedPassword,
        licenseNumber: faker.string.alphanumeric({
          length: 8,
          casing: 'upper',
        }),
        licenseExpiryDate: faker.date.between({
          from: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
          to: new Date(new Date().setFullYear(new Date().getFullYear() + 3)),
        }),
        isActive: faker.datatype.boolean(0.9), // 90% chance of being active
      },
    });
    drivers.push(driver);
  }

  console.log(`✅ Created ${drivers.length} drivers`);
  return drivers;
}
