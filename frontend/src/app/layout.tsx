import './globals.css';
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-green-50 via-cyan-50 to-blue-100">
        <Navbar/>
        <main className="max-w-2xl mx-auto p-4 mt-6">{children}</main>
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  );
}
