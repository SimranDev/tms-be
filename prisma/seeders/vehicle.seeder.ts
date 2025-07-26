import { PrismaClient, Vehicle, VehicleType } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedVehicles(prisma: PrismaClient): Promise<Vehicle[]> {
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
        rego: faker.vehicle.vin().substring(0, 8).toUpperCase(),
        vinNumber: faker.vehicle.vin(),
        type: vehicleType,
        capacityKg: faker.number.int({ min: 1000, max: 40000 }),
        registrationExpiry: faker.date.between({
          from: new Date(new Date().setMonth(new Date().getMonth() - 2)),
          to: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
        }),
        insuranceExpiry: faker.date.between({
          from: new Date(new Date().setMonth(new Date().getMonth() - 2)),
          to: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        }),
        isActive: faker.datatype.boolean(0.95),
      },
    });
    vehicles.push(vehicle);
  }

  console.log(`✅ Created ${vehicles.length} vehicles`);
  return vehicles;
}
