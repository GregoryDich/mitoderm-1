import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb/mongodb';

// Функция для проверки учетных данных
const validateCredentials = async (email: string, password: string): Promise<boolean | object> => {
  // Для предопределенного администратора
  if (email === 'mitoderm@gmail.com' && password === '1234678905') {
    return {
      id: 'admin',
      name: 'Administrator',
      email: 'mitoderm@gmail.com',
      role: 'admin'
    };
  }

  try {
    const client = await clientPromise;
    const db = client.db('mitoderm');
    const user = await db.collection('users').findOne({ email });

    if (!user) return false;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return false;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };
  } catch (error) {
    console.error('Error validating credentials:', error);
    return false;
  }
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Проверка учетных данных
    const validationResult = await validateCredentials(email, password);

    if (!validationResult) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Создание JWT токена выполняется в NextAuth.js
    // Здесь просто возвращаем информацию о пользователе
    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: validationResult
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 