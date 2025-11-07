// src/app/layout.tsx

import "./globals.css";
import Navbar from "../components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vardiya Sistemi",
  description: "Çalışan vardiya yönetim uygulaması",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="bg-gray-50 text-gray-800">
        <Navbar />
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
