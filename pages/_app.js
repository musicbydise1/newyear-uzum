import "../styles/globals.scss";
import { LanguageProvider } from "../contexts/LanguageContext";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </Head>
      <Component {...pageProps} />
    </LanguageProvider>
  );
}

export default MyApp;
