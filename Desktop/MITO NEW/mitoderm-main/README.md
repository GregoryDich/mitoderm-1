# MitoDerm

Официальный веб-сайт MitoDerm - инновационного решения для эстетической медицины.

## Особенности

- Многоязычный интерфейс (английский, русский, иврит)
- Адаптивный дизайн для всех устройств
- Галерея "До/После" для демонстрации результатов
- Система отзывов
- Административная панель для управления контентом
- Интеграция с базой данных MongoDB

## Технологии

- Next.js 14
- React 18
- TypeScript
- SCSS Modules
- MongoDB
- NextAuth.js для аутентификации
- next-intl для интернационализации

## Требования

- Node.js 18.17.0 или выше
- MongoDB Atlas аккаунт или локальная MongoDB

## Установка

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/yourusername/mitoderm.git
   cd mitoderm
   ```

2. Установите зависимости:
   ```bash
   npm install
   ```

3. Создайте файл `.env.local` на основе `.env.example` и заполните необходимые переменные окружения:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_key
   NEXT_PUBLIC_GOOGLE_ID=your_google_analytics_id
   ```

4. Запустите сервер разработки:
   ```bash
   npm run dev
   ```

5. Откройте [http://localhost:3000](http://localhost:3000) в вашем браузере.

## Административная панель

Для доступа к административной панели перейдите по адресу:
- [http://localhost:3000/admin](http://localhost:3000/admin)

Используйте следующие учетные данные:
- Email: mitoderm@gmail.com
- Пароль: 1234678905

В административной панели вы можете:
- Управлять галереей "До/После"
- Управлять отзывами
- Добавлять новых пользователей (только для администраторов)

## Структура проекта

```
mitoderm/
├── public/             # Статические файлы
├── src/                # Исходный код
│   ├── app/            # Маршруты приложения
│   ├── components/     # React компоненты
│   ├── lib/            # Библиотеки и утилиты
│   ├── models/         # Mongoose модели
│   ├── i18n/           # Интернационализация
│   └── types.ts        # TypeScript типы
├── messages/           # Файлы переводов
├── .env.local          # Переменные окружения
└── package.json        # Зависимости и скрипты
```

## Деплой

Для деплоя на продакшн:

```bash
npm run build
npm run start
```

## Лицензия

Все права защищены © MitoDerm
