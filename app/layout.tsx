import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./components/Providers";
import PWAInstaller from "./components/PWAInstaller";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata = {
  title: "Market Iguazú - Comercios Locales",
  description: "Descubre y conecta con comercios locales de Iguazú, Misiones. Encuentra productos, servicios y contacta directamente con los comerciantes.",
  keywords: "Iguazú, Misiones, comercios, locales, marketplace, productos, servicios",
  authors: [{ name: "Market Iguazú" }],
  creator: "Market Iguazú",
  publisher: "Market Iguazú",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://market-iguazu.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Market Iguazú - Comercios Locales",
    description: "Descubre y conecta con comercios locales de Iguazú, Misiones",
    url: 'https://market-iguazu.vercel.app',
    siteName: 'Market Iguazú',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Market Iguazú - Comercios Locales',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Market Iguazú - Comercios Locales",
    description: "Descubre y conecta con comercios locales de Iguazú, Misiones",
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Market Iguazú',
    startupImage: [
      '/icons/icon-512x512.png',
    ],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#7c3aed' },
    { media: '(prefers-color-scheme: dark)', color: '#1e293b' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
        <PWAInstaller />
      </body>
    </html>
  );
}
