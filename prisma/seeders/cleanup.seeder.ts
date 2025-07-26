import { PrismaClient } from '@prisma/client';

export async function cleanDatabase(prisma: PrismaClient): Promise<void> {
  console.log('🧹 Cleaning existing data...');

  // Delete in proper order to respect foreign key constraints
  await prisma.job.deleteMany();
  await prisma.customerLocation.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.location.deleteMany();
  await prisma.user.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.container.deleteMany();

  console.log('✅ Database cleaned successfully');
}
