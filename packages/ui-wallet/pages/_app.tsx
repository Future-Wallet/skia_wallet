import { AppProps } from 'next/app';
import Head from 'next/head';
import { RecoilRoot } from 'recoil';

import '../styles/global.css';

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <RecoilRoot>
      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      {/* <Layout navigationBar={NavigationBar()}> */}
      <Component {...pageProps} />
      {/* </Layout> */}
    </RecoilRoot>
  );
}
