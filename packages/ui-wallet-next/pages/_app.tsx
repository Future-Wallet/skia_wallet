import { AppProps } from 'next/app';
import Head from 'next/head';
import React, { useEffect } from 'react';
import { RecoilRoot, useRecoilSnapshot } from 'recoil';

import '../styles/global.css';

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <RecoilRoot>
      <DebugObserver />
      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      <React.StrictMode>
        <Component {...pageProps} />
      </React.StrictMode>
    </RecoilRoot>
  );
}

function DebugObserver(): JSX.Element {
  const snapshot = useRecoilSnapshot();

  useEffect(() => {
    console.debug('The following atoms were modified:');
    for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
      console.debug(node.key, snapshot.getLoadable(node));
    }
  }, [snapshot]);

  return null;
}
