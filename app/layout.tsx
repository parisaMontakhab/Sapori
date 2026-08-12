import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import QueryProvider from "@/components/providers/QueryProvider";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sapori — Italian Food Delivery",
  description: "Order authentic Italian dishes delivered to your door.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`${geist.className} flex min-h-screen flex-col overflow-x-hidden bg-cream text-foreground`}
      >
        <QueryProvider>
          <Navbar />
          <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-6 sm:px-6 sm:py-10">
            {children}
          </main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
