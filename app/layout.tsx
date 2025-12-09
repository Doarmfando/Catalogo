import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hyundai Perú | Catálogo de Vehículos 2025-2026",
  description: "Encuentra el vehículo ideal para ti. Catálogo completo de modelos Hyundai: SUV, Sedán, Hatchback, Utilitarios y Comerciales. Financiamiento disponible.",
  keywords: ["Hyundai", "vehículos", "autos", "SUV", "sedán", "catálogo", "Perú", "financiamiento"],
  openGraph: {
    title: "Hyundai Perú | Catálogo de Vehículos",
    description: "Encuentra el vehículo ideal para ti. Catálogo completo de modelos Hyundai.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
