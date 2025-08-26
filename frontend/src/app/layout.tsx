import '@/styles/globals.css'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Providers } from '@/store/providers';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#F62D40" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Точка Склада" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* PWA мета-теги */}
        <meta name="application-name" content="Точка Склада" />
        <meta name="description" content="Система управления складскими ячейками" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#F62D40" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        
        {/* Иконки */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#F62D40" />
        <link rel="apple-touch-icon" href="/fivicon.svg"></link>
        
        {/* Манифест */}
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="h-full overflow-hidden">
        <Providers>
          {children}
          <ToastContainer />
          <PWAInstallPrompt />
        </Providers>
      </body>
    </html>
  )
} 