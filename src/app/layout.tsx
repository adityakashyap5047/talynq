import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Talynq",
  description: "Talynq is a modern job creation and talent discovery platform that connects skilled individuals with the right opportunities — faster, smarter, and easier.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
