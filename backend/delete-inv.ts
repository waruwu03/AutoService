import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const inv = await prisma.invoice.findFirst({ where: { invoiceNumber: 'INV-20260705-001' }});
  console.log(JSON.stringify(inv));
  if (inv) {
    await prisma.invoice.delete({ where: { id: inv.id }});
    console.log('Deleted');
  } else {
    console.log('Not found');
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
