/**
 * Скрипт для настройки MongoDB Atlas и создания начальной структуры базы данных
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Путь к файлу .env.local
const envPath = path.join(process.cwd(), '.env.local');

// Функция для чтения текущего .env.local
const readEnvFile = () => {
  try {
    return fs.readFileSync(envPath, 'utf8');
  } catch (err) {
    console.error('Ошибка при чтении .env.local:', err);
    return '';
  }
};

// Функция для записи в .env.local
const writeEnvFile = (content) => {
  try {
    fs.writeFileSync(envPath, content);
    return true;
  } catch (err) {
    console.error('Ошибка при записи в .env.local:', err);
    return false;
  }
};

// Функция для обновления строки подключения MongoDB
const updateMongoDBUri = (uri) => {
  const envContent = readEnvFile();
  const updatedContent = envContent.replace(
    /MONGODB_URI=.*/,
    `MONGODB_URI=${uri}`
  );
  return writeEnvFile(updatedContent);
};

// Функция для создания коллекций и индексов
const setupDatabase = async (uri) => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Подключение к MongoDB Atlas успешно установлено.');

    const db = client.db('mitoderm');

    // Создаем необходимые коллекции, если они еще не существуют
    await db.createCollection('users');
    await db.createCollection('gallery');
    await db.createCollection('reviews');
    await db.createCollection('blog_posts');
    await db.createCollection('site_content');
    await db.createCollection('seo_settings');
    await db.createCollection('analytics_page_views');
    await db.createCollection('analytics_form_submissions');

    // Создаем индексы для оптимизации запросов
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('blog_posts').createIndex({ 'slug.en': 1 }, { unique: true });
    await db.collection('blog_posts').createIndex({ 'slug.ru': 1 }, { unique: true });
    await db.collection('blog_posts').createIndex({ 'slug.he': 1 }, { unique: true });
    await db.collection('site_content').createIndex({ key: 1 }, { unique: true });
    await db.collection('seo_settings').createIndex({ page: 1 }, { unique: true });

    console.log('База данных успешно настроена с необходимыми коллекциями и индексами.');
    await client.close();
    return true;
  } catch (err) {
    console.error('Ошибка при настройке базы данных:', err);
    return false;
  }
};

console.log('Настройка MongoDB Atlas для проекта MitoDerm');
console.log('--------------------------------------------');
console.log('Введите данные подключения для MongoDB Atlas:');

rl.question('Имя пользователя (по умолчанию: mitoderm): ', (username) => {
  username = username || 'mitoderm';
  
  rl.question('Пароль (по умолчанию: mitoderm123): ', (password) => {
    password = password || 'mitoderm123';
    
    rl.question('Имя кластера (по умолчанию: cluster0): ', (cluster) => {
      cluster = cluster || 'cluster0';
      
      rl.question('ID проекта (Project ID): ', (projectId) => {
        if (!projectId) {
          console.error('ID проекта обязателен для подключения.');
          rl.close();
          return;
        }
        
        const uri = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/mitoderm?retryWrites=true&w=majority&appName=Project%20${encodeURIComponent(projectId)}`;
        
        console.log(`\nСтрока подключения: ${uri}`);
        
        rl.question('Обновить .env.local с этой строкой подключения? (y/n): ', async (answer) => {
          if (answer.toLowerCase() === 'y') {
            if (updateMongoDBUri(uri)) {
              console.log('Файл .env.local успешно обновлен.');
              
              console.log('Настраиваем базу данных...');
              if (await setupDatabase(uri)) {
                console.log('Настройка MongoDB Atlas успешно завершена!');
              }
            }
          } else {
            console.log('Операция отменена. Файл .env.local не был изменен.');
          }
          rl.close();
        });
      });
    });
  });
}); 