const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Remove all dark: classes
      // This regex matches dark: followed by any valid tailwind class characters
      const newContent = content.replace(/dark:[a-zA-Z0-9/.-]+/g, '');
      
      if (content !== newContent) {
        // Clean up any double spaces left behind
        const cleanedContent = newContent.replace(/  +/g, ' ');
        fs.writeFileSync(fullPath, cleanedContent, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
