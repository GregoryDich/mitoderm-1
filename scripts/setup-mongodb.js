/** Скрипт для настройки MongoDB Atlas и создания начальной структуры базы данных */
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
console.log('Запустите скрипт командой: npm run setup-mongodb');
console.log('Этот скрипт поможет настроить подключение к MongoDB Atlas и создать необходимые коллекции.');
