import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aesthetic Portfolio",
  description: "A premium slide-based portfolio managed from a private admin dashboard."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}