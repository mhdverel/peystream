import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Peystream - Streaming Drama China Terbaik",
    template: "%s | Peystream"
  },
  description: "Nonton drama China terbaru dan terpopuler secara online. Drama pendek, serial, dan sulih suara Bahasa Indonesia tersedia di Peystream.",
  keywords: ["drama china", "streaming", "drama pendek", "nonton drama", "sulih suara", "drama indonesia"],
  authors: [{ name: "Peystream" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Peystream",
    title: "Peystream - Streaming Drama China Terbaik",
    description: "Nonton drama China terbaru dan terpopuler secara online.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.className} antialiased bg-[#0a0a0a] text-white min-h-screen`}>
        <Navbar />
        <main className="pt-16 md:pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
