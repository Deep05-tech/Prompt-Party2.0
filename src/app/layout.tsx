import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prompt Party 2.0 - Pirate Arena Portal",
  description: "A gamified AI competition platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cinzel.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body 
        suppressHydrationWarning
        className="min-h-full flex flex-col text-slate-200 transition-colors duration-500"
        style={{ 
          background: 'var(--theme-app-bg, var(--color-ocean-900))',
          backgroundAttachment: 'fixed'
        }}
      >
        <Providers>
          <ThemeProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
