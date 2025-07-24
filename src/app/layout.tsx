import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from '@clerk/themes'
import HeaderClient from "@/components/HeaderClient";
import FooterClient from "@/components/FooterClient";

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
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#2d3748",
          colorBackground: "#111112",
          colorInputBackground: "#2d3748",
          colorInputText: "#e5e7eb",
          colorText: "#f3f4f6",
          colorTextSecondary: "#9ca3af",
          colorDanger: "#ef4444",
          colorSuccess: "#10b981"
        }
      }}
    >
      <html lang="en" suppressHydrationWarning>
          <body>
            <div className="bg-grid" />
            <ThemeProvider defaultTheme="dark" attribute="class">
              <div className="min-h-screen flex flex-col">
                <HeaderClient />
                <main className="flex-1 container mx-auto lg:max-w-[95%]">
                  {children}
                </main>
                <FooterClient />
              </div>
            </ThemeProvider>
          </body>
      </html>
    </ClerkProvider>
  );
}
