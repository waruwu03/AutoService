/// <reference types="node" />
import { 
  PrismaClient, 
  UserRole, 
  ServiceCategory,
  CustomerType,
  VehicleType,
  SparepartCategory,
  WorkOrderStatus,
  WorkOrderPriority,
  InvoiceStatus,
  PaymentMethod
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

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
  
  // 1.1 Create Pimpinan User
  const pimpinanPassword = await bcrypt.hash('pimpinan123', 12);
  await prisma.user.upsert({
    where: { email: 'pimpinan@autoservis.com' },
    update: {},
    create: {
      email: 'pimpinan@autoservis.com',
      password: pimpinanPassword,
      name: 'Bapak Pimpinan',
      role: UserRole.PIMPINAN,
      isActive: true,
    },
  });
  console.log('✅ Pimpinan user created');

  // 1.2 Create Mekanik User
  const mekanikPassword = await bcrypt.hash('mekanik123', 12);
  const mekanik = await prisma.user.upsert({
    where: { email: 'mekanik@autoservis.com' },
    update: {},
    create: {
      email: 'mekanik@autoservis.com',
      password: mekanikPassword,
      name: 'Budi Mekanik',
      role: UserRole.MEKANIK,
      isActive: true,
    },
  });
  console.log('✅ Mekanik user created');

  // 1.3 Create Gudang User
  const gudangPassword = await bcrypt.hash('gudang123', 12);
  await prisma.user.upsert({
    where: { email: 'gudang@autoservis.com' },
    update: {},
    create: {
      email: 'gudang@autoservis.com',
      password: gudangPassword,
      name: 'Siti Gudang',
      role: UserRole.GUDANG,
      isActive: true,
    },
  });
  console.log('✅ Gudang user created');


  // 2. Create Services
  const servicesData = [
    { code: 'SRV-001', name: 'Ganti Oli Mesin', category: ServiceCategory.SERVIS_BERKALA, basePrice: 50000, estimatedDuration: 30 },
    { code: 'SRV-002', name: 'Tune Up Ringan', category: ServiceCategory.SERVIS_BERKALA, basePrice: 150000, estimatedDuration: 60 },
    { code: 'SRV-003', name: 'Servis AC', category: ServiceCategory.AC_COOLING, basePrice: 250000, estimatedDuration: 120 },
    { code: 'SRV-004', name: 'Spooring & Balancing', category: ServiceCategory.KAKI_KAKI, basePrice: 200000, estimatedDuration: 45 },
  ];
  let serviceIds = [];
  for (const s of servicesData) {
    const srv = await prisma.service.upsert({
      where: { code: s.code },
      update: {},
      create: s,
    });
    serviceIds.push(srv.id);
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

  // 4. Create Default Settings
  const settingsData = [
    { key: 'business_name', value: 'AutoServis', group: 'BUSINESS', description: 'Nama bengkel' },
    { key: 'business_tagline', value: 'Bengkel Otomotif Terpercaya', group: 'BUSINESS', description: 'Tagline bengkel' },
    { key: 'business_address', value: 'Jl. Raya Utama No. 123, Jakarta Selatan', group: 'BUSINESS', description: 'Alamat lengkap bengkel' },
    { key: 'business_phone', value: '021-5551234', group: 'BUSINESS', description: 'Nomor telepon bengkel' },
    { key: 'business_email', value: 'info@autoservis.id', group: 'BUSINESS', description: 'Email resmi bengkel' },
    { key: 'tax_rate', value: '11', group: 'FINANCE', description: 'Tarif PPN (%)' },
    { key: 'invoice_prefix', value: 'INV', group: 'FINANCE', description: 'Awalan nomor invoice' },
    { key: 'spk_prefix', value: 'SPK', group: 'WORK_ORDER', description: 'Awalan nomor SPK' },
  ];
  for (const s of settingsData) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log('✅ Default settings seeded');

  // 5. Create Mock Customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'Andi Saputra',
      phone: '08111222333',
      email: 'andi@example.com',
      customerType: CustomerType.PRIBADI,
    }
  });
  
  const customer2 = await prisma.customer.create({
    data: {
      name: 'PT. Maju Bersama',
      phone: '02199887766',
      email: 'contact@majubersama.co.id',
      customerType: CustomerType.KORPORAT,
      companyName: 'PT. Maju Bersama',
    }
  });
  console.log('✅ Mock Customers seeded');

  // 6. Create Mock Vehicles
  const vehicle1 = await prisma.vehicle.create({
    data: {
      customerId: customer1.id,
      licensePlate: 'B 1234 ABC',
      brand: 'Toyota',
      model: 'Avanza',
      vehicleType: VehicleType.MOBIL,
      year: 2020,
    }
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      customerId: customer2.id,
      licensePlate: 'D 5678 DEF',
      brand: 'Honda',
      model: 'CR-V',
      vehicleType: VehicleType.MOBIL,
      year: 2022,
    }
  });
  console.log('✅ Mock Vehicles seeded');

  // 7. Create Mock Spareparts
  const sparepart1 = await prisma.sparepart.upsert({
    where: { code: 'SP-OLI-001' },
    update: {},
    create: {
      code: 'SP-OLI-001',
      name: 'Oli Mesin TMO 10W-40',
      category: SparepartCategory.OLI_PELUMAS,
      brand: 'Toyota',
      unit: 'Liter',
      buyPrice: 65000,
      sellPrice: 85000,
      stockQuantity: 50,
      minStock: 10,
      supplierId: supplier.id,
    }
  });

  const sparepart2 = await prisma.sparepart.upsert({
    where: { code: 'SP-FLT-001' },
    update: {},
    create: {
      code: 'SP-FLT-001',
      name: 'Filter Oli Avanza',
      category: SparepartCategory.FILTER,
      brand: 'Toyota',
      unit: 'Pcs',
      buyPrice: 35000,
      sellPrice: 50000,
      stockQuantity: 30,
      minStock: 5,
      supplierId: supplier.id,
    }
  });
  console.log('✅ Mock Spareparts seeded');

  // 8. Create Mock WorkOrders (SPK)
  // SPK 1: In Progress
  const wo1 = await prisma.workOrder.create({
    data: {
      orderNumber: 'SPK-202607-0001',
      customerId: customer1.id,
      vehicleId: vehicle1.id,
      status: WorkOrderStatus.IN_PROGRESS,
      priority: WorkOrderPriority.NORMAL,
      assignedMechanicId: mekanik.id,
      customerComplaints: 'Mesin terasa berat saat digas.',
      totalServiceCost: 0,
      totalPartsCost: 0,
      grandTotal: 0,
      createdById: admin.id,
    }
  });

  // SPK 2: Completed and Invoiced
  const wo2 = await prisma.workOrder.create({
    data: {
      orderNumber: 'SPK-202607-0002',
      customerId: customer2.id,
      vehicleId: vehicle2.id,
      status: WorkOrderStatus.COMPLETED,
      priority: WorkOrderPriority.NORMAL,
      assignedMechanicId: mekanik.id,
      customerComplaints: 'Waktunya servis berkala.',
      mechanicNotes: 'Oli dan filter sudah diganti.',
      totalServiceCost: 50000,
      totalPartsCost: 135000, // 85000 (Oli) + 50000 (Filter)
      grandTotal: 185000,
      createdById: admin.id,
      services: {
        create: [
          { serviceId: serviceIds[0], quantity: 1, unitPrice: 50000, totalPrice: 50000, performedById: mekanik.id }
        ]
      },
      spareparts: {
        create: [
          { sparepartId: sparepart1.id, quantity: 1, unitPrice: 85000, totalPrice: 85000 },
          { sparepartId: sparepart2.id, quantity: 1, unitPrice: 50000, totalPrice: 50000 }
        ]
      }
    }
  });
  console.log('✅ Mock WorkOrders seeded');

  // 9. Create Mock Invoice & Payment for WO2
  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-202607-0001',
      workOrderId: wo2.id,
      customerId: customer2.id,
      status: InvoiceStatus.PAID,
      subtotal: 185000,
      taxAmount: 0,
      grandTotal: 185000,
      amountPaid: 185000,
      amountDue: 0,
      dueDate: new Date(),
      paidDate: new Date(),
      createdById: admin.id,
      payments: {
        create: [
          {
            amount: 185000,
            paymentMethod: PaymentMethod.CASH,
            receivedById: admin.id,
          }
        ]
      }
    }
  });
  console.log('✅ Mock Invoices & Payments seeded');

  console.log('✨ Full mock data seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
