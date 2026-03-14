const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    fs.readdirSync(dir).forEach(f => {
        f = path.resolve(dir, f);
        const s = fs.statSync(f);
        if (s.isDirectory()) results = results.concat(walk(f));
        else if (f.endsWith('-table.tsx')) results.push(f);
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Fix 1: Replace <DropdownMenuLabel>Actions</DropdownMenuLabel> 
    // with a simple styled p tag (no GroupLabel context needed)
    if (content.includes('<DropdownMenuLabel>')) {
        content = content.replace(
            /<DropdownMenuLabel>Actions<\/DropdownMenuLabel>/g,
            '<p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Actions</p>'
        );
        content = content.replace(
            /<DropdownMenuLabel>([^<]*)<\/DropdownMenuLabel>/g,
            '<p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">$1</p>'
        );
        modified = true;
    }

    // Fix 2: Remove DropdownMenuLabel from imports if no longer used
    if (!content.includes('<DropdownMenuLabel>') && content.includes('DropdownMenuLabel')) {
        content = content.replace(/,\s*DropdownMenuLabel/g, '');
        content = content.replace(/DropdownMenuLabel,\s*/g, '');
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed:', path.basename(file));
    }
});
