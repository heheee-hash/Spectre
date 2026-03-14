const fs = require('fs');

const opsTables = [
  'src/components/receipts/receipt-table.tsx',
  'src/components/deliveries/delivery-table.tsx',
  'src/components/transfers/transfer-table.tsx',
  'src/components/adjustments/adjustment-table.tsx',
];

opsTables.forEach(t => {
  if (fs.existsSync(t)) {
    let content = fs.readFileSync(t, 'utf8');
    if(!content.includes('useSession')) {
      content = content.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { useSession } from "next-auth/react";');
      content = content.replace(/export function \w+Table\(\) {/, match => match + '\n    const { data: session } = useSession();\n    const isManager = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER";\n');
      
      // Hide Delete MenuItem (usually Cancel or Delete for operations)
      content = content.replace(/<DropdownMenuSeparator \/>\n\s*<DropdownMenuItem[\s\S]*?(?:Trash2|XCircle)[\s\S]*?<\/DropdownMenuItem>/g, match => `{isManager && (\n                                            <>\n${match}\n                                            </>\n                                            )}`);
      
      fs.writeFileSync(t, content);
      console.log('Updated ' + t);
    }
  }
});
