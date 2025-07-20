import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Talynq",
  description: "Talynq is a modern job creation and talent discovery platform that connects skilled individuals with the right opportunities — faster, smarter, and easier.",
  icons: {
    icon: "/talynq/talynq-icon.png",
    shortcut: "/talynq/talynq-icon.png",
    apple: "/talynq/talynq-icon.png",
  }
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
