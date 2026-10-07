import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {

  useEffect(()=>{
    if('serviceWorker' in navigator && process.env.NODE_ENV === 'production'){
      navigator.serviceWorker
      .register('/sw.js')
      .then((reg)=>console.log('Sajhedar SW registered successfully:', reg.scope))
      .catch((e)=>console.error("SW registration failed:",e))
    }
  },[])

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
} 