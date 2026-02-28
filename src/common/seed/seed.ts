import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role, AccountStatus } from 'generated/prisma/client';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is missing in environment variables');
}

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({
  adapter,
  log: [{ emit: 'event', level: 'error' }],
});

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';

  const hash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      role: Role.ADMIN,
      activeRole: Role.ADMIN,
      accountStatus: AccountStatus.ACTIVE,
      isEmailVerified: true,
    },
    create: {
      email,
      password: hash,
      role: Role.ADMIN,
      activeRole: Role.ADMIN,
      accountStatus: AccountStatus.ACTIVE,
      isEmailVerified: true,
    },
  });

  console.log('✅ Admin seeded:', email);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });