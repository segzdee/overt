const fs = require('fs');
const path = require('path');

function displayDirectory(dir = '.', level = 0) {
  const indent = '  '.repeat(level);
  console.log(`${indent}📁 ${path.basename(dir)}/`);
  
  try {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        displayDirectory(filePath, level + 1);
      } else if (!file.startsWith('.')) {
        console.log(`${indent}  📄 ${file}`);
      }
    });
  } catch (err) {
    console.log(`${indent}  ❌ Error reading directory: ${err.message}`);
  }
}

console.log('\nProject Directory Structure:');
console.log('==========================\n');
displayDirectory('.');

