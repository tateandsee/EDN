import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Providers } from "@/components/providers";
import ErrorBoundary from "@/components/error-boundary";
import { UpgradePopup } from "@/components/upgrade-popup";
import { UpgradePopupWrapper } from "@/components/upgrade-popup-wrapper";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EDN Platform - AI-Powered Content Creation",
  description: "EDN Platform: Create, distribute, and monetize AI-generated content with our powerful platform. Professional tools for creators, businesses, and developers.",
  keywords: ["EDN", "EDN Platform", "AI content creation", "Content distribution", "AI generation", "Next.js", "TypeScript"],
  authors: [{ name: "EDN Platform Team" }],
  openGraph: {
    title: "EDN Platform - AI Content Creation Platform",
    description: "AI-powered content creation and distribution platform",
    url: "https://ednplatform.com",
    siteName: "EDN Platform",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EDN Platform - AI Content Creation Platform",
    description: "AI-powered content creation and distribution platform",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          <ErrorBoundary>
            <Navigation />
            <main className="min-h-screen pt-16">
              {children}
            </main>
            <Footer />
          </ErrorBoundary>
          <Toaster />
          <Sonner />
          <UpgradePopupWrapper />
        </Providers>
      </body>
    </html>
  );
}
