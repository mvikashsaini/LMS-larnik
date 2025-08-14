const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Larnik LMS Backend...\n');

// Create necessary directories
const directories = [
  'uploads',
  'uploads/videos',
  'uploads/documents',
  'uploads/images',
  'uploads/certificates',
  'uploads/mous',
  'certificates',
  'templates',
  'logs'
];

console.log('📁 Creating directories...');
directories.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created: ${dir}`);
  } else {
    console.log(`ℹ️  Already exists: ${dir}`);
  }
});

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', 'env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ Created .env file from template');
} else if (fs.existsSync(envPath)) {
  console.log('ℹ️  .env file already exists');
} else {
  console.log('⚠️  env.example not found, please create .env manually');
}

// Create default certificate template
const templatePath = path.join(__dirname, '..', 'templates', 'certificate-template.pdf');
if (!fs.existsSync(templatePath)) {
  console.log('ℹ️  Certificate template not found. You can add your own template later.');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Edit .env file with your configuration');
console.log('2. Install dependencies: npm install');
console.log('3. Start the server: npm run dev');
console.log('4. Access API docs: http://localhost:5000/api-docs');
console.log('\n📚 For more information, check the README.md file');
