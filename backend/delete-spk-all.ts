import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const spks = await prisma.workOrder.findMany({ where: { orderNumber: 'SPK-202607-0001' }});
  console.log('SPKs:', JSON.stringify(spks));
  
  for (const spk of spks) {
    console.log('Deleting ID:', spk.id);
    try { await prisma.partRequest.deleteMany({ where: { workOrderId: spk.id }}); } catch(e) {}
    try { await prisma.invoice.deleteMany({ where: { workOrderId: spk.id }}); } catch(e) {}
    await prisma.workOrder.delete({ where: { id: spk.id }});
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
