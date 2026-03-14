const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');

  // Fix 1: schema z.coerce.number() -> z.number()
  content = content.replace(/z\.coerce\.number\(\)/g, 'z.number()');

  // Fix 2: register input number -> register(..., { valueAsNumber: true })
  // e.g. {...form.register('newQty')} type="number" -> {...form.register('newQty', { valueAsNumber: true })} type="number"
  content = content.replace(/\{\.\.\.form\.register\('([^']+)'\)\}([^>]+type="number")/g, "{...form.register('$1', { valueAsNumber: true })}$2");
  content = content.replace(/\{\.\.\.form\.register\("([^"]+)"\)\}([^>]+type="number")/g, '{...form.register("$1", { valueAsNumber: true })}$2');

  // Fix 3: Select onValueChange setStatusFilter -> (v) => setStatusFilter(v || 'all')
  content = content.replace(/onValueChange=\{setStatusFilter\}/g, "onValueChange={(v) => setStatusFilter(v || 'all')}");
  content = content.replace(/onValueChange=\{setTypeFilter\}/g, "onValueChange={(v) => setTypeFilter(v || 'all')}");

  // Fix 4: form.watch('x') inside Select value -> form.watch('x') || ''
  content = content.replace(/value=\{form\.watch\('([^']+)'\)\}/g, "value={form.watch('$1') || ''}");
  
  // Fix 5: DropdownMenuTrigger / TooltipTrigger asChild errors
  // header.tsx
  if (filePath.includes('header.tsx')) {
    content = content.replace(/<DropdownMenuTrigger asChild>[\s\S]*?<div role="button"[^>]*className="([^"]+)"[^>]*>([\s\S]*?)<\/div>[\s\S]*?<\/DropdownMenuTrigger>/, 
      '<DropdownMenuTrigger className="$1">$2</DropdownMenuTrigger>');
    content = content.replace(/forceMount/g, ''); // Fix forceMount error
  }
  
  if (filePath.includes('sidebar.tsx')) {
    content = content.replace(/<TooltipTrigger asChild>([\s\S]*?)<\/TooltipTrigger>/g, (match, p1) => {
      // Just remove asChild from TooltipTrigger since it might cause TS issues if not typed properly
      return `<TooltipTrigger>${p1}</TooltipTrigger>`;
    });
    content = content.replace(/delayDuration=\{[^}]+\}/g, ''); // Fix delayDuration error
  }

  // Handle data in handleSubmit explicitly if it still complains:
  // (data) => createMutation.mutate(data) to (data: FormData) => createMutation.mutate(data)
  content = content.replace(/form\.handleSubmit\(\(data\) =>/g, "form.handleSubmit((data: FormData) =>");

  fs.writeFileSync(filePath, content, 'utf-8');
}

const files = [
  'app/(dashboard)/adjustments/page.tsx',
  'app/(dashboard)/deliveries/page.tsx',
  'app/(dashboard)/products/page.tsx',
  'app/(dashboard)/receipts/page.tsx',
  'app/(dashboard)/stock-ledger/page.tsx',
  'app/(dashboard)/transfers/page.tsx',
  'components/layout/header.tsx',
  'components/layout/sidebar.tsx'
];

files.forEach(f => fixFile(path.join(srcDir, f)));
console.log("Fixed files.");
