const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');

  // Fix 1: Revert FormData explicit type, let TS infer
  content = content.replace(/form\.handleSubmit\(\(data: FormData\) =>/g, "form.handleSubmit((data) =>");
  
  // Fix 2: Handle string | null for setValue
  content = content.replace(/\(v\) => form\.setValue\('([^']+)', v\)/g, "(v) => form.setValue('$1', v || '')");

  // Fix 3: Handle setCategoryFilter in products/page.tsx
  content = content.replace(/onValueChange=\{setCategoryFilter\}/g, "onValueChange={(v) => setCategoryFilter(v || 'all')}");

  fs.writeFileSync(filePath, content, 'utf-8');
}

const files = [
  'app/(dashboard)/adjustments/page.tsx',
  'app/(dashboard)/deliveries/page.tsx',
  'app/(dashboard)/products/page.tsx',
  'app/(dashboard)/receipts/page.tsx',
  'app/(dashboard)/stock-ledger/page.tsx',
  'app/(dashboard)/transfers/page.tsx'
];

files.forEach(f => fixFile(path.join(srcDir, f)));
console.log("Fixed files step 2.");
