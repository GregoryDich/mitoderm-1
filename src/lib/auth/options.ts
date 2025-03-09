import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';
import clientPromise from '../mongodb/mongodb';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials) return null;
        
        try {
          const client = await clientPromise;
          const db = client.db('mitoderm');
          const user = await db.collection('users').findOne({ email: credentials.email });

          // Для простоты реализации мы также добавим проверку на предопределенного администратора
          if (
            credentials.email === 'mitoderm@gmail.com' && 
            credentials.password === '1234678905'
          ) {
            return {
              id: 'admin',
              name: 'Administrator',
              email: 'mitoderm@gmail.com',
              role: 'admin'
            };
          }

          if (!user) return null;

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) return null;

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin',
    error: '/admin',
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 