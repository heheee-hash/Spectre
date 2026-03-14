const fs = require('fs');
const glob = require('fs').promises;
const { execSync } = require('child_process');

// We will replace <Button asChild>\n<Link href="...">Icon Text</Link>\n</Button>
// with <Link href="..." className={buttonVariants({ variant: "default" })}>Icon Text</Link>

const files = [
  'src/components/warehouses/warehouse-table.tsx',
  'src/components/warehouses/warehouse-form.tsx',
  'src/components/warehouses/location-table.tsx',
  'src/components/warehouses/location-form.tsx',
  'src/components/transfers/transfer-table.tsx',
  'src/components/transfers/transfer-form.tsx',
  'src/components/receipts/receipt-table.tsx',
  'src/components/receipts/receipt-form.tsx',
  'src/components/products/category-table.tsx',
  'src/components/products/category-form.tsx',
  'src/components/products/product-table.tsx',
  'src/components/products/product-form.tsx',
  'src/components/deliveries/delivery-table.tsx',
  'src/components/deliveries/delivery-form.tsx',
  'src/components/adjustments/adjustment-table.tsx',
  'src/components/adjustments/adjustment-form.tsx',
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

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    
    // First, let's remove asChild from <Button variant="outline" asChild> type things
    // Actually, just making the Link have the flex classes is easier if we keep Button.
    // Replace <Button ... asChild> \n <Link ...> with just <Button ...> \n <Link className="flex items-center gap-2">
    content = content.replace(/<Button([^>]*)asChild([^>]*)>([\s\S]*?)<Link ([^>]*)>/g, '<Button$1$2>$3<Link $4 className="flex h-full w-full items-center justify-center gap-2">');
    
    // Handle cases where `asChild` was the only prop or added explicitly
    content = content.replace(/<Button\s+asChild>/g, '<Button>');
    
    fs.writeFileSync(f, content);
    console.log('Fixed ' + f);
  }
});
