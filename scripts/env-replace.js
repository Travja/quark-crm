const fs = require('fs');
const path = require('path');
require('dotenv').config();

const envFile = path.resolve(__dirname, '../.env');
const config = require('dotenv').parse(fs.readFileSync(envFile));

const distDir = path.resolve(__dirname, '../dist'); // Adjust if your output directory is different

function replaceInFile(filePath) {
  let fileContent = fs.readFileSync(filePath, 'utf8');

  for (const [key, value] of Object.entries(config)) {
    const regex = new RegExp(`process.env.${key}`, 'g');
    fileContent = fileContent.replace(regex, JSON.stringify(value));
  }

  fs.writeFileSync(filePath, fileContent, 'utf8');
  console.log(`Replaced environment variables in ${filePath}`);
}

function traverseDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      traverseDir(filePath);
    } else if (filePath.endsWith('.js')) {
      // Modify .js files
      replaceInFile(filePath);
    }
  });
}

traverseDir(distDir);
