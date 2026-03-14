const fs = require('fs');

const pages = [
  'src/app/(dashboard)/products/page.tsx', 
  'src/app/(dashboard)/categories/page.tsx',
  'src/app/(dashboard)/warehouses/page.tsx',
  'src/app/(dashboard)/locations/page.tsx'
];

pages.forEach(p => {
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    if(!content.includes('getServerSession')) {
      content = 'import { getServerSession } from "next-auth";\nimport { authOptions } from "@/lib/auth";\n' + content;
      content = content.replace('export default function', 'export default async function');
      content = content.replace(/export default async function \w+\(\) \{\n/, match => match + '    const session = await getServerSession(authOptions);\n    const isManager = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER";\n');
      content = content.replace(/action=\{\n\s*<Button([^>]*)>([\s\S]*?)<\/Button>\n\s*\}/g, 'action={ isManager ? (\n                    <Button$1>$2</Button>\n                ) : null }');
      fs.writeFileSync(p, content);
      console.log('Updated ' + p);
    }
  }
});

const tables = [
  'src/components/products/product-table.tsx',
  'src/components/products/category-table.tsx',
  'src/components/warehouses/warehouse-table.tsx',
  'src/components/warehouses/location-table.tsx'
];

tables.forEach(t => {
  if (fs.existsSync(t)) {
    let content = fs.readFileSync(t, 'utf8');
    if(!content.includes('useSession')) {
      content = content.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { useSession } from "next-auth/react";');
      content = content.replace(/export function \w+Table\(\) {/, match => match + '\n    const { data: session } = useSession();\n    const isManager = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER";\n');
      
      // Hide standard FileEdit block links
      content = content.replace(/<Link href=\{`\/[^`]+`\} className="block">\n\s*<DropdownMenuItem[\s\S]*?<FileEdit[^>]*> Edit[\s\S]*?<\/Link>/g, match => `{isManager && (\n                                            ${match}\n                                            )}`);
      // Hide standard Link Edit
      content = content.replace(/<Link href=\{`\/[^`]+\/edit`\}>\s*<FileEdit[^>]*> Edit[^<]*<\/Link>/g, match => `{isManager && (\n                                                ${match}\n                                            )}`);
      
      // Hide Delete MenuItem
      content = content.replace(/<DropdownMenuSeparator \/>\n\s*<DropdownMenuItem variant="destructive"[\s\S]*?<Trash2[\s\S]*?<\/DropdownMenuItem>/g, match => `{isManager && (\n                                            <>\n${match}\n                                            </>\n                                            )}`);
      
      fs.writeFileSync(t, content);
      console.log('Updated ' + t);
    }
  }
});
