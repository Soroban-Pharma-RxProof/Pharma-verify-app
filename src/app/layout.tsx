import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { OfflineBanner } from '../components/OfflineBanner';
import { LanguageProvider } from '../i18n/LanguageContext';
import { WalletProvider } from '../context/WalletContext';

export const metadata: Metadata = {
  title: 'Soroban Pharma RxProof | Counterfeit Medicine Verification',
  description:
    'Enterprise pharmaceutical authentication and batch traceability powered by Stellar and Soroban smart contracts.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
        <LanguageProvider>
          <WalletProvider>
            <OfflineBanner />
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </WalletProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
