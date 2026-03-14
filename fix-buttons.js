const fs = require('fs');
const path = require('path');

const files = [
  'src/components/warehouses/warehouse-table.tsx',
  'src/components/warehouses/location-table.tsx',
  'src/components/transfers/transfer-table.tsx',
  'src/components/receipts/receipt-table.tsx',
  'src/components/products/category-table.tsx',
  'src/components/products/product-table.tsx',
  'src/components/deliveries/delivery-table.tsx',
  'src/components/adjustments/adjustment-table.tsx',
  'src/app/(dashboard)/transfers/page.tsx',
  'src/app/(dashboard)/warehouses/page.tsx',
  'src/app/(dashboard)/receipts/page.tsx',
  'src/app/(dashboard)/categories/page.tsx',
  'src/app/(dashboard)/products/page.tsx',
  'src/app/(dashboard)/locations/page.tsx',
  'src/app/(dashboard)/products/[productId]/page.tsx',
  'src/app/(dashboard)/deliveries/page.tsx',
  'src/app/(dashboard)/adjustments/page.tsx'
];

let updated = 0;
files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content.replace(/<Button([^>]*)>(\s*)<Link\b/g, (match, p1, p2) => {
      if (p1.includes('asChild') || p1.includes('child')) return match;
      return `<Button${p1} asChild>${p2}<Link`;
    });
    if (newContent !== content) {
      fs.writeFileSync(file, newContent);
      console.log(`Updated ${file}`);
      updated++;
    }
  }
});
console.log(`Updated ${updated} UI files.`);
