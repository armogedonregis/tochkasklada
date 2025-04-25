import '../styles/globals.css'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>
        <main>
          {children}
        </main>
        <ToastContainer />
      </body>
    </html>
  )
} 