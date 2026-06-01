import Layout from '@/components/Layout';
import { LanguageProvider } from '@/lib/LanguageContext';
import '@/styles/globals.css';
import { Inter, Noto_Sans_Khmer } from 'next/font/google';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useMotionVariants } from '@/lib/animations';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

const notoKhmer = Noto_Sans_Khmer({
  subsets: ['khmer'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-khmer',
});

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const mv = useMotionVariants();

  return (
    <div className={`${inter.variable} ${notoKhmer.variable}`}>
      <LanguageProvider>
        <Layout>
          {/*
           * mode="wait" — old page exits fully before the new one enters,
           * keeping the nav/footer stable throughout.
           * initial={false} — suppresses the very first mount animation on
           * cold page load (hydration already painted the page).
           */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={router.pathname}
              variants={mv.page}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Component {...pageProps} />
            </motion.div>
          </AnimatePresence>
        </Layout>
      </LanguageProvider>
    </div>
  );
}
