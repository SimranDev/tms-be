import { PrismaClient, Location } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedLocations(prisma: PrismaClient): Promise<Location[]> {
  console.log('📍 Creating location records...');

  const australianCities = [
    {
      city: 'Sydney',
      state: 'NSW',
      postcode: '2000',
      lat: -33.8688,
      lng: 151.2093,
    },
    {
      city: 'Melbourne',
      state: 'VIC',
      postcode: '3000',
      lat: -37.8136,
      lng: 144.9631,
    },
    {
      city: 'Brisbane',
      state: 'QLD',
      postcode: '4000',
      lat: -27.4698,
      lng: 153.0251,
    },
    {
      city: 'Perth',
      state: 'WA',
      postcode: '6000',
      lat: -31.9505,
      lng: 115.8605,
    },
    {
      city: 'Adelaide',
      state: 'SA',
      postcode: '5000',
      lat: -34.9285,
      lng: 138.6007,
    },
  ];

  const locations: Location[] = [];

  // Create locations for customer addresses and job pickup/delivery points
  for (let i = 0; i < 20; i++) {
    const cityInfo = faker.helpers.arrayElement(australianCities);
    const streetNumber = faker.number.int({ min: 1, max: 999 }).toString();
    const streetName = faker.location.street();

    // Add some random variation to coordinates (within ~5km radius)
    const latVariation = (faker.number.float() - 0.5) * 0.1; // ~5km variance
    const lngVariation = (faker.number.float() - 0.5) * 0.1;

    const location: Location = await prisma.location.create({
      data: {
        herePlaceId: faker.string.alphanumeric({ length: 20, casing: 'upper' }),
        label: `${streetNumber} ${streetName}, ${cityInfo.city}`,
        streetNumber,
        streetName,
        suburb: faker.location.city(),
        city: cityInfo.city,
        postcode: cityInfo.postcode,
        countryCode: 'AUS',
        latitude: cityInfo.lat + latVariation,
        longitude: cityInfo.lng + lngVariation,
      },
    });
    locations.push(location);
  }

  console.log(`✅ Created ${locations.length} locations`);
  return locations;
}
