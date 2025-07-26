import { PrismaClient, Customer, Location } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedCustomers(
  prisma: PrismaClient,
  locations: Location[],
): Promise<Customer[]> {
  console.log('🏢 Creating 5 customers with Australian addresses...');

  const customers: Customer[] = [];

  for (let i = 0; i < 5; i++) {
    const addressLocation = faker.helpers.arrayElement(locations);

    const customer = await prisma.customer.create({
      data: {
        companyName: faker.company.name(),
        contactPerson: `${faker.person.firstName()} ${faker.person.lastName()}`,
        email: faker.internet.email(),
        phoneNumber: `+61 ${faker.number.int({ min: 2, max: 9 })}${faker.number.int({ min: 1000, max: 9999 })}${faker.number.int({ min: 1000, max: 9999 })}`,
        addressId: addressLocation.id,
      },
    });
    customers.push(customer);

    // Create customer-location relationships (many-to-many)
    // Each customer gets 2-4 additional locations they can use
    const additionalLocations = faker.helpers.arrayElements(
      locations.filter((loc) => loc.id !== addressLocation.id),
      { min: 2, max: 4 },
    );

    for (const location of additionalLocations) {
      await prisma.customerLocation.create({
        data: {
          customerId: customer.id,
          locationId: location.id,
        },
      });
    }
  }

  console.log(`✅ Created ${customers.length} customers`);
  return customers;
}
