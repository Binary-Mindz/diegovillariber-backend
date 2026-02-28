import { AccountStatus, PrismaClient, Role } from "generated/prisma/client";
import * as bcrypt from 'bcrypt';

export async function seedAdmin(prisma: PrismaClient) {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin@123';

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: Role.ADMIN,
      activeRole: Role.ADMIN,
      accountStatus: AccountStatus.ACTIVE,
      isEmailVerified: true,
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: Role.ADMIN,
      activeRole: Role.ADMIN,
      accountStatus: AccountStatus.ACTIVE,
      isEmailVerified: true,
    },
  });
}