import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";

// urbanist - primary font from google fonts
const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
});

export const metadata: Metadata = {
  title: "Eshkon Page Builder",
  description: "RBAC page builder with draft/preview/publish flows",
};

// root layout - wraps all routes
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={urbanist.variable}>
      <body className="min-h-screen bg-beige text-gray-800 antialiased">
        {children}
      </body>
    </html>
  );
}
