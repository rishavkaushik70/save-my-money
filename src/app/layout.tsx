import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "SaveMyMoney - Smart Personal Finance",
    template: "%s | SaveMyMoney",
  },

  description:
    "SaveMyMoney helps you track expenses, manage income, set financial goals, and build better money habits.",

  keywords: [
    "personal finance",
    "expense tracker",
    "money management",
    "budget tracker",
    "financial goals",
    "income tracker",
    "SaveMyMoney",
  ],

  authors: [{ name: "SaveMyMoney" }],

  creator: "SaveMyMoney",

  applicationName: "SaveMyMoney",

  icons: {
    icon: "/icon.png",
  },

  openGraph: {
    title: "SaveMyMoney - Smart Personal Finance",
    description:
      "Track your money, manage expenses, and achieve your financial goals with SaveMyMoney.",
    siteName: "SaveMyMoney",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "SaveMyMoney - Smart Personal Finance",
    description:
      "Track your money, manage expenses, and achieve your financial goals.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={cn(
          "min-h-screen font-sans antialiased grainy",
          inter.className,
        )}
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
