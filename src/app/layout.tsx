import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';

import "./globals.css";

import { ModalProvider } from "@/providers/ModalProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <ClerkProvider>
    <html lang='en'>
      <body>
        <ThemeProvider 
        attribute="class" 
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange>

          <ToastProvider/>
          <ModalProvider/>
          {children}

        </ThemeProvider>
      </body>
    </html>
  </ClerkProvider>
  );
}

