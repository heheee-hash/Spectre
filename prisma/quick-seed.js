const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: 'postgresql://postgres:postgres@localhost:5432/core_inventory' });

async function seed() {
  const managerHash = await bcrypt.hash('manager123', 10);
  const staffHash = await bcrypt.hash('staff123', 10);

  console.log('Starting raw SQL seed...');

  try {
    // Insert Manager
    await pool.query(`
      INSERT INTO "User" (id, name, email, "hashedPassword", role, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role, "hashedPassword" = EXCLUDED."hashedPassword"
    `, ['user_manager_1', 'Inventory Manager', 'manager@example.com', managerHash, 'MANAGER']);

    // Insert Staff
    await pool.query(`
      INSERT INTO "User" (id, name, email, "hashedPassword", role, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role, "hashedPassword" = EXCLUDED."hashedPassword"
    `, ['user_staff_1', 'Warehouse Staff', 'staff@example.com', staffHash, 'STAFF']);

    console.log('Seed successful:');
    console.log('Manager: manager@example.com / manager123');
    console.log('Staff: staff@example.com / staff123');
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    await pool.end();
  }
}

seed();
