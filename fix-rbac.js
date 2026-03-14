const fs = require('fs');

const files = [
  'src/app/api/products/route.ts',
  'src/app/api/products/[productId]/route.ts',
  'src/app/api/categories/route.ts',
  'src/app/api/categories/[categoryId]/route.ts',
  'src/app/api/warehouses/route.ts',
  'src/app/api/warehouses/[warehouseId]/route.ts',
  'src/app/api/locations/route.ts',
  'src/app/api/locations/[locationId]/route.ts'
];

let updatedCount = 0;

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  
  let content = fs.readFileSync(f, 'utf8');
  let originalContent = content;
  
  // Ensure requireRole is imported
  if (!content.includes('requireRole')) {
    content = content.replace('requireAuth }', 'requireAuth, requireRole }');
  }

  // Replace requireAuth with requireRole in POST, PATCH, DELETE
  // This is a naive but effective regex for the specific pattern we have
  content = content.replace(/export const POST = apiHandler\(async \([^)]*\) => \{\n\s*await requireAuth\(\);/g, match => match.replace('requireAuth()', 'requireRole(["ADMIN", "MANAGER"])'));
  content = content.replace(/export const PATCH = apiHandler\(async \([^)]*\) => \{\n\s*await requireAuth\(\);/g, match => match.replace('requireAuth()', 'requireRole(["ADMIN", "MANAGER"])'));
  content = content.replace(/export const DELETE = apiHandler\(async \([^)]*\) => \{\n\s*await requireAuth\(\);/g, match => match.replace('requireAuth()', 'requireRole(["ADMIN", "MANAGER"])'));

  if (content !== originalContent) {
    fs.writeFileSync(f, content);
    console.log('Updated ' + f);
    updatedCount++;
  }
});

console.log('Total files updated: ' + updatedCount);
