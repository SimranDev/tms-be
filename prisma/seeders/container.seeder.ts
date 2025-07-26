import {
  PrismaClient,
  Container,
  ContainerType,
  ContainerSize,
  ContainerStatus,
} from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedContainers(
  prisma: PrismaClient,
): Promise<Container[]> {
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
        })}`,
        type: faker.helpers.arrayElement(containerTypes),
        size: faker.helpers.arrayElement(containerSizes),
        status: faker.helpers.arrayElement(containerStatuses),
        notes: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : null,
      },
    });
    containers.push(container);
  }

  console.log(`✅ Created ${containers.length} containers`);
  return containers;
}
