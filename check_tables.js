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

walk(path.join(__dirname, 'src')).forEach(f => {
    const c = fs.readFileSync(f, 'utf8');
    if (c.includes('Button variant="ghost" className="h-8 w-8 p-0"')) {
        console.log('NEEDS FIX:', path.basename(f));
    } else {
        console.log('OK:', path.basename(f));
    }
});
