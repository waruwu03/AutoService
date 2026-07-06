import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const spk = await prisma.workOrder.findFirst({ where: { orderNumber: 'SPK-202607-0001' }});
  if (spk) {
    try {
      await prisma.partRequest.deleteMany({ where: { workOrderId: spk.id }});
    } catch(e) {}
    try {
      await prisma.invoice.deleteMany({ where: { workOrderId: spk.id }});
    } catch(e) {}

    await prisma.workOrder.delete({ where: { id: spk.id }});
    console.log('SPK Deleted');
  } else {
    console.log('SPK Not found');
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
