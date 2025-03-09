const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Директория для хранения сертификатов
const certsDir = path.join(__dirname, '../certs');

// Создаем директорию, если она не существует
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
}

// Пути к файлам сертификатов
const keyPath = path.join(certsDir, 'localhost-key.pem');
const certPath = path.join(certsDir, 'localhost.pem');

// Проверяем, существуют ли уже сертификаты
if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  console.log('SSL certificates already exist. Skipping generation.');
  process.exit(0);
}

console.log('Generating SSL certificates for local development...');

try {
  // Генерируем самоподписанный сертификат с помощью OpenSSL
  execSync(`openssl req -x509 -newkey rsa:2048 -nodes -keyout ${keyPath} -out ${certPath} -days 365 -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"`, {
    stdio: 'inherit'
  });
  
  console.log('SSL certificates generated successfully!');
  console.log(`Key: ${keyPath}`);
  console.log(`Certificate: ${certPath}`);
  
  // Инструкции для пользователя
  console.log('\nTo use these certificates:');
  console.log('1. Add them to your trusted certificates in your OS/browser');
  console.log('2. Update your next.config.mjs to use HTTPS');
  console.log('3. Run the development server with HTTPS=true npm run dev');
} catch (error) {
  console.error('Error generating SSL certificates:', error.message);
  console.log('\nYou may need to install OpenSSL:');
  console.log('- macOS: brew install openssl');
  console.log('- Windows: Download from https://slproweb.com/products/Win32OpenSSL.html');
  console.log('- Linux: apt-get install openssl or yum install openssl');
  process.exit(1);
} 