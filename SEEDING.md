# Database Seeding

This project includes a comprehensive database seeding script to populate your development database with realistic test data.

## What Gets Seeded

- **3 Users** (including 1 admin user)
- **15 Drivers** with realistic transportation industry data

## How to Run

```bash
# Run the seed script
pnpm run db:seed
```

## Login Credentials

### Admin User

- Email: `admin@tms.com`
- Password: `admin123`

### Other Users

- Password: `user123`

### All Drivers

- Password: `driver123`

## Generated Data

The seed script creates realistic data using Faker.js:

### Users

- First and last names
- Unique email addresses
- Properly hashed passwords

### Drivers

- First and last names
- Unique email addresses and phone numbers
- Random license numbers (8 characters)
- License expiry dates (within 3 years)
- 90% chance of being active

## Password Security

All passwords are properly hashed using bcrypt with a salt rounds of 10, matching your application's authentication system.

## Development Tips

- Run the seed script whenever you need fresh test data
- The script clears existing Users and Drivers before seeding
- All generated emails are unique to avoid conflicts
- Use the documented passwords above for testing authentication flows
