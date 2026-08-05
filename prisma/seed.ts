import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from 'src/generated/prisma/client';
import { Role } from 'src/generated/prisma/enums';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // Credentials come from env with sane fallbacks so the script works
  // out-of-the-box for reviewers, but can be overridden without touching code.
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@dealport.com';
  const plainPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin@12345';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // upsert, not create — makes the script safe to re-run without
  // "unique constraint" errors during development or on redeploy.
  const admin = await prisma.user.upsert({
    where: { email },
    update: {}, // if the user already exists, leave it untouched
    create: {
      email,
      password: hashedPassword,
      name: 'DEALPORT Admin',
      role: Role.ADMIN,
    },
  });

  console.log('Seeded admin user:');
  console.log(`  email:    ${admin.email}`);
  console.log(
    `  password: ${plainPassword} (plain — shown for local dev only)`,
  );
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
