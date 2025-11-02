import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Central Square",
  description: "A digital agora where communities thrive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
