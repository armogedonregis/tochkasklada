import '@/styles/globals.css'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Providers } from '@/store/providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full">
      <body className="h-full overflow-hidden">
        <Providers>
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  )
} 