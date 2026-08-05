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
  // ─── Categories ─────────────────────────────────────
  const categories = [
    { name: 'Electronic', slug: 'electronic' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Home', slug: 'home' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Books', slug: 'books' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`✅ Seeded ${categories.length} categories`);

  // ─── Tags ───────────────────────────────────────────
  const tags = [
    { name: 'New Arrival', slug: 'new-arrival' },
    { name: 'Best Seller', slug: 'best-seller' },
    { name: 'Sale', slug: 'sale' },
    { name: 'Limited Edition', slug: 'limited-edition' },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }
  console.log(`✅ Seeded ${tags.length} tags`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
