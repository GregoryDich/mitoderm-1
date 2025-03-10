import createNextIntlPlugin from 'next-intl/plugin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const withNextIntl = createNextIntlPlugin();

// Получаем текущую директорию
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Пути к сертификатам
const keyPath = join(__dirname, 'certs', 'localhost-key.pem');
const certPath = join(__dirname, 'certs', 'localhost.pem');

// Проверяем, существуют ли сертификаты
const httpsConfig = fs.existsSync(keyPath) && fs.existsSync(certPath)
  ? {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    }
  : undefined;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // Настройка для HTTPS в режиме разработки
  devServer: {
    https: httpsConfig,
  },
  async redirects() {
    return [
      {
        source: '/:slug((?!en|ru|he)[^/]+)',
        destination: '/en',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
