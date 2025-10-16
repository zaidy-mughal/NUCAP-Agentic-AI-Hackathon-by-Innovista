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
          // Hide all floating buttons and elements that appear on pages
          impersonationFab: { display: "none" },
          userButtonPopoverMain: { display: "none" },
          // Hide the organization switcher if it exists
          organizationSwitcherPopoverMain: { display: "none" },
          // Hide any other potential floating elements
          scrollBox: { display: "none" },
        }
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning>{children}</body>
      </html>
    </ClerkProvider>
  );
}