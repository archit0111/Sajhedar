import {Html, Head, Main, NextScript} from 'next/document';

export default function Document(){
    return(
        <Html lang="en">
            <Head>
                <link rel="manifest" href='/manifest.json' />
                <meta name='theme-color' content='#0F172A' />
                <link rel='apple-touch-icon' href='/icon.png'/>
            </Head>
            <body>
                <Main/>
                <NextScript/>
            </body>
        </Html>
    );
}