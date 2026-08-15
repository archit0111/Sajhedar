import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

//console.log("DEBUG ENV:", process.env);
// Debug: Check environment variables
//console.log('=== NextAuth Environment Debug ===');
//console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET');
//console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET');
//console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
//console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET');
//console.log('================================');

// Check if required environment variables are set
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn('Warning: Google OAuth credentials not found. Please check your .env.local file.');
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials){
        if(!credentials?.email||!credentials.password){
          throw Error('Please enter both email and password.');
        }
        const client =  await clientPromise;
        const db = client.db('Sajhedar');

        const user = await db.collection('users').findOne({email:credentials.email});

        if(!user || !user.password){
          throw new Error('No user found with this email...');
        }

        const isValid = await bcrypt.compare(credentials.password,user.password);
        if(!isValid){
          throw Error('Invalid password.')
        }

        return {
          id:user._id.toString(),
          name:user.name,
          email:user.email
        }
      }
    })
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/dashboard',
  },
  debug: process.env.NODE_ENV === 'development',
});

export { default as config } from 'next-auth'; 