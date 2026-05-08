import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpendLens — AI Spend Audit",
  description: "Identify where your startup is overspending on AI tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#04040a] text-[#f1f5f9]">
        {children}
      </body>
    </html>
  );
}
