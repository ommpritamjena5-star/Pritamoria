const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for(const file of files) {
    const fullPath = path.join(dir, file);
    if(fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if(fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      // match from "package@version" or 'package@version'
      // regex to match @ followed by version number like @0.487.0, @1.1.2
      // but only inside import strings!
      const regex = /from\s+['"]([^'"]+)@\d+\.\d+\.\d+['"]/g;
      const newContent = content.replace(regex, "from '$1'");
      
      const regex2 = /import\s+['"]([^'"]+)@\d+\.\d+\.\d+['"]/g;
      const newContent2 = newContent.replace(regex2, "import '$1'");

      // Also need to handle sonner@2.0.3, next-themes@0.4.6, etc which are not scoped
      
      if(content !== newContent2) {
        fs.writeFileSync(fullPath, newContent2);
        console.log('Fixed imports in', fullPath);
      }
    }
  }
}

processDir(path.join(process.cwd(), 'src'));
console.log('Finished fixing imports');
