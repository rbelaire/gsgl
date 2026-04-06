import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gulf South Golf Lab",
  description: "Golf fitting MVP with rules-based recommendations",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
