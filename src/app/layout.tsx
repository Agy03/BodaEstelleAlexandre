import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeSwitcherByDate } from "@/components/layout/ThemeSwitcherByDate";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale, getTranslations } from 'next-intl/server';

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');
  return {
    title: t('title'),
    description: t('description'),
    keywords: ["boda", "wedding", "Estelle", "celebración", "RSVP"],
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const locale = await getLocale();
  
  return (
    <html lang={locale} className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-inter antialiased bg-[var(--color-background)] text-[var(--color-text)]">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <ThemeSwitcherByDate>
              <Navbar />
              <main className="min-h-screen pt-16 md:pt-20">
                {children}
              </main>
              <Footer />
            </ThemeSwitcherByDate>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
