const fs = require('fs');
const path = require('path');
const p = path.join(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));
for(const key of Object.keys(pkg.dependencies)) {
  if(key.indexOf('@', 1) > 0) {
    delete pkg.dependencies[key];
  }
}
fs.writeFileSync(p, JSON.stringify(pkg, null, 2));
console.log('Fixed package.json properly');
