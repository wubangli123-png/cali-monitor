import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Monitor Cali — Noticias en tiempo real",
  description: "Dashboard de noticias de Cali y el Valle del Cauca, actualizado automáticamente cada 30 minutos.",
  openGraph: {
    title: "Monitor Cali",
    description: "Noticias de Cali y el Valle del Cauca en tiempo real",
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
