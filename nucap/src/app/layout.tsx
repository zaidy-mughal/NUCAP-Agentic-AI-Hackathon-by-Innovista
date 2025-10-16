import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NUCAP - National University Admission Platform",
  description: "Find your perfect university match and never miss an admission deadline",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          // Hide the floating button that appears on pages
          impersonationFab: { display: "none" },
          // Also hide any other floating elements
          userButtonPopoverMain: { display: "none" },
        }
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning>{children}</body>
      </html>
    </ClerkProvider>
  );
}