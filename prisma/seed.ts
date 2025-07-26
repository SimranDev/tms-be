import { PrismaClient } from '@prisma/client';
import {
  cleanDatabase,
  seedUsers,
  seedDrivers,
  seedVehicles,
  seedContainers,
  seedLocations,
  seedCustomers,
  seedJobs,
} from './seeders';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data (optional - remove if you want to keep existing data)
  await cleanDatabase(prisma);

  // Seed all entities in proper order
  const users = await seedUsers(prisma);
  const drivers = await seedDrivers(prisma);
  const vehicles = await seedVehicles(prisma);
  const containers = await seedContainers(prisma);
  const locations = await seedLocations(prisma);
  const customers = await seedCustomers(prisma, locations);
  const jobs = await seedJobs(
    prisma,
    customers,
    containers,
    drivers,
    vehicles,
    users,
    locations,
  );

  // Display summary
  console.log('\n📊 Seed Summary:');
  console.log('================');
  console.log(`👥 Users: ${users.length}`);
  console.log(`🏢 Customers: ${customers.length}`);
  console.log(`🚛 Drivers: ${drivers.length}`);
  console.log(`🚗 Vehicles: ${vehicles.length}`);
  console.log(`📦 Containers: ${containers.length}`);
  console.log(`📍 Locations: ${locations.length}`);
  console.log(`📋 Jobs: ${jobs.length}`);

  console.log('\n🔑 Login Credentials:');
  console.log('====================');
  console.log('Admin User:');
  console.log('  Email: sim.admin@tms.com');
  console.log('  Password: admin123');
  console.log('\nSim Driver:');
  console.log('  Email: sim.driver@tms.com');
  console.log('  Password: driver123');
  console.log('\nOther Users & Drivers:');
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
