import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';

import * as bcrypt from 'bcrypt';
import { AccountStatus, BadgeRarity, BadgeStatus, BadgeTargetType, PrismaClient, Role } from 'generated/prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is missing in environment variables');
}

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({
  adapter,
  log: [{ emit: 'event', level: 'error' }],
});

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';

  const existingAdmin = await prisma.user.findUnique({
    where: { email },
    select: { id: true, password: true },
  });

  let hash = existingAdmin?.password;

  if (!hash) {
    hash = await bcrypt.hash(password, 10);
  }

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

  console.log(`✅ Admin seeded: ${email}`);
}

async function seedBadges() {
  const badges = [
    {
      name: 'Prestige Collector',
      slug: 'prestige-collector',
      description: 'Accumulate Prestige Points',
      icon: '💎',
      rarity: BadgeRarity.LEGENDARY,
      status: BadgeStatus.ACTIVE,
      targetTypes: [BadgeTargetType.ANY],
      sortOrder: 1,
      isHidden: false,
    },
    {
      name: 'Community Member',
      slug: 'community-member',
      description: 'Join the Motorsport community',
      icon: '🌟',
      rarity: BadgeRarity.COMMON,
      status: BadgeStatus.ACTIVE,
      targetTypes: [BadgeTargetType.ANY],
      sortOrder: 2,
      isHidden: false,
    },
    {
      name: 'Track Ready',
      slug: 'track-ready',
      description: 'Record your first lap time',
      icon: '🏁',
      rarity: BadgeRarity.COMMON,
      status: BadgeStatus.ACTIVE,
      targetTypes: [BadgeTargetType.PRO_DRIVER],
      sortOrder: 3,
      isHidden: false,
    },
    {
      name: 'Content Creator',
      slug: 'content-creator',
      description: 'Share your first automotive content',
      icon: '🎬',
      rarity: BadgeRarity.COMMON,
      status: BadgeStatus.ACTIVE,
      targetTypes: [BadgeTargetType.CONTENT_CREATOR],
      sortOrder: 4,
      isHidden: false,
    },
    {
      name: 'Automotive Influencer',
      slug: 'automotive-influencer',
      description: 'Build a following in the community',
      icon: '🌼',
      rarity: BadgeRarity.EPIC,
      status: BadgeStatus.ACTIVE,
      targetTypes: [BadgeTargetType.OWNER],
      sortOrder: 5,
      isHidden: false,
    },
    {
      name: 'Proud Owner',
      slug: 'proud-owner',
      description: 'Share your first car',
      icon: '🚗',
      rarity: BadgeRarity.COMMON,
      status: BadgeStatus.ACTIVE,
      targetTypes: [BadgeTargetType.OWNER],
      sortOrder: 6,
      isHidden: false,
    },
    {
      name: 'Popular Spotter',
      slug: 'popular-spotter',
      description: 'Accumulate likes on your spots',
      icon: '❤️',
      rarity: BadgeRarity.EPIC,
      status: BadgeStatus.ACTIVE,
      targetTypes: [BadgeTargetType.SPOTTER],
      sortOrder: 7,
      isHidden: false,
    },
    {
      name: 'Dedicated Spotter',
      slug: 'dedicated-spotter',
      description: 'Share multiple spots',
      icon: '📸',
      rarity: BadgeRarity.RARE,
      status: BadgeStatus.ACTIVE,
      targetTypes: [BadgeTargetType.SPOTTER],
      sortOrder: 8,
      isHidden: false,
    },
    {
      name: 'First Spot',
      slug: 'first-spot',
      description: 'Post your first car spot',
      icon: '📍',
      rarity: BadgeRarity.COMMON,
      status: BadgeStatus.ACTIVE,
      targetTypes: [BadgeTargetType.SPOTTER],
      sortOrder: 9,
      isHidden: false,
    },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: {
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        rarity: badge.rarity,
        status: badge.status,
        targetTypes: badge.targetTypes,
        sortOrder: badge.sortOrder,
        isHidden: badge.isHidden,
      },
      create: {
        name: badge.name,
        slug: badge.slug,
        description: badge.description,
        icon: badge.icon,
        rarity: badge.rarity,
        status: badge.status,
        targetTypes: badge.targetTypes,
        sortOrder: badge.sortOrder,
        isHidden: badge.isHidden,
      },
    });
  }

  console.log(`✅ ${badges.length} badges seeded`);
}

async function main() {
  console.log('🚀 Seeding started...');

  await seedAdmin();
  await seedBadges();

  console.log('✅ All seeds completed successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });