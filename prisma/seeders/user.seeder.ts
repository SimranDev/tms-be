import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {
  console.log('👥 Creating 3 users...');

  // Pre-hash common passwords for better performance
  const hashedPasswords = {
    user: await bcrypt.hash('user123', 10),
    admin: await bcrypt.hash('admin123', 10),
  };

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
  return users;
}
