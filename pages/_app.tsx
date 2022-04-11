import type { AppProps } from 'next/app';
import { GlobalContextProvider } from '../components/GlobalProvider';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <GlobalContextProvider>
            <Component {...pageProps} />
        </GlobalContextProvider>
    );
}

export default MyApp;
