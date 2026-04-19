import { PrismaClient, UserRole, ServiceCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@autoservis.com' },
    update: {},
    create: {
      email: 'admin@autoservis.com',
      password: adminPassword,
      name: 'System Admin',
      role: UserRole.ADMIN,
      isActive: true,
    },
  });
  console.log('✅ Admin user created');

  // 2. Create Services
  const servicesData = [
    {
      code: 'SRV-001',
      name: 'Ganti Oli Mesin',
      category: ServiceCategory.SERVIS_BERKALA,
      basePrice: 50000,
      estimatedDuration: 30,
    },
    {
      code: 'SRV-002',
      name: 'Tune Up Ringan',
      category: ServiceCategory.SERVIS_BERKALA,
      basePrice: 150000,
      estimatedDuration: 60,
    },
    {
      code: 'SRV-003',
      name: 'Servis AC',
      category: ServiceCategory.AC_COOLING,
      basePrice: 250000,
      estimatedDuration: 120,
    },
    {
      code: 'SRV-004',
      name: 'Spooring & Balancing',
      category: ServiceCategory.KAKI_KAKI,
      basePrice: 200000,
      estimatedDuration: 45,
    },
  ];

  for (const s of servicesData) {
    await prisma.service.upsert({
      where: { code: s.code },
      update: {},
      create: s,
    });
  }
  console.log('✅ Basic services seeded');

  // 3. Create a Test Supplier
  const supplier = await prisma.supplier.upsert({
    where: { code: 'SUP-001' },
    update: {},
    create: {
      code: 'SUP-001',
      name: 'PT. Sparepart Indonesia',
      contactPerson: 'Budi',
      phone: '08123456789',
      address: 'Jakarta Selatan',
    },
  });
  console.log('✅ Test supplier seeded');

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
