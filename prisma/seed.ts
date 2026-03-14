import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const managerPassword = await bcrypt.hash('manager123', 10);
  const staffPassword = await bcrypt.hash('staff123', 10);

  // Upsert Manager
  await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      email: 'manager@example.com',
      name: 'Inventory Manager',
      hashedPassword: managerPassword,
      role: 'INVENTORY_MANAGER',
    },
  });

  // Upsert Staff
  await prisma.user.upsert({
    where: { email: 'staff@example.com' },
    update: {},
    create: {
      email: 'staff@example.com',
      name: 'Warehouse Staff',
      hashedPassword: staffPassword,
      role: 'WAREHOUSE_STAFF',
    },
  });

  console.log('Seed successful:');
  console.log('Manager: manager@example.com / manager123');
  console.log('Staff: staff@example.com / staff123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
