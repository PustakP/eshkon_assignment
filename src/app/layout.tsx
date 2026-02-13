import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="min-h-screen bg-beige text-gray-800 antialiased">
        {children}
      </body>
    </html>
  );
}
