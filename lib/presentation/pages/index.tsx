import Head from 'next/head';
import Link from 'next/link';
import App from './_app';

export default function Home({}) {
  return (
    <div>
      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <main>
        <div>
          <Link href={'/getting-started'}>
            <a>Getting started</a>
          </Link>
        </div>
      </main>
    </div>
  );
}
