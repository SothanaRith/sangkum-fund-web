import Layout from '@/components/Layout';
import { LanguageProvider } from '@/lib/LanguageContext';
import '@/styles/globals.css';
import { Inter, Noto_Sans_Khmer } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--font-inter' });
const notoKhmer = Noto_Sans_Khmer({ subsets: ['khmer'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--font-noto-khmer' });

export default function App({ Component, pageProps }) {
  return (
    <div className={`${inter.variable} ${notoKhmer.variable}`}>
      <LanguageProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </LanguageProvider>
    </div>
  );
}
