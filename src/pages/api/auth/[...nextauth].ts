import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
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
      allowDangerousEmailAccountLinking: true,
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
        
        if(!user){
          throw new Error('No user found with these credentials.');
        }

        if (!user?.password || user?.provider === "google") {
           throw new Error(
            "This account was created using Google. Please sign in with Google."
          );
        }
        if(!user || !user.password){
          throw new Error('No user found with this email...');
        }

        const isValid = await bcrypt.compare(credentials.password,user.password);
        if(!isValid){
          throw Error('Invalid credentials. Please try again.')
        }

        return {
          id:user._id.toString(),
          name:user.name,
          email:user.email
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({user,account}){
      if(account?.provider === 'google'){
        const client = await clientPromise;
        const db=client.db('Sajhedar');

        const existingUser = await db.collection('users').findOne({email:user.email});
        if(!existingUser){
          const newUser = await db.collection('users').insertOne({
            name:user.name,
            email:user.email,
            image:user.image,
            provider:'google',
            createdAt:new Date()
          });
          user.id = newUser.insertedId.toString();
        }else{
          user.id=existingUser._id.toString();
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }else if(token.email && !token.id){
        const client = await clientPromise;
        const db = client.db('Sajhedar');
        const dbUser = await db.collection('users').findOne({email:token.email});
        if(dbUser) token.id = dbUser._id.toString();
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error:'/login'
  },
  debug: process.env.NODE_ENV === 'development',
});

export { default as config } from 'next-auth'; 