import type { Metadata } from "next";
import { Inter, Manrope, Space_Grotesk } from "next/font/google"; // Space_Grotesk for headings, Manrope for body
import "./globals.css";
import { Toaster } from "react-hot-toast";

import { Navbar } from "@/components/ui/navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: "AI README Generator | Create GitHub READMEs in Seconds",
    template: "%s | AI README Generator",
  },
  description: "Generate comprehensive, beautiful, and SEO-optimized README files for your GitHub projects instantly using advanced AI technology. Enhance your project visibility today.",
  keywords: ["README generator", "AI readme", "GitHub readme", "developer tools", "documentation generator", "open source"],
  authors: [{ name: "Vineet" }], // Update with actual author name if needed
  openGraph: {
    title: "AI README Generator",
    description: "Generate comprehensive README files for your GitHub projects using AI.",
    url: "https://readme-agent.vercel.app", // Replace with actual production URL
    siteName: "AI README Generator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI README Generator",
    description: "Generate comprehensive README files for your GitHub projects using AI.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable} ${spaceGrotesk.variable} font-sans antialiased bg-white`}>
        <Navbar />
        {children}
        <Toaster position="bottom-right" />
        {/* Google Analytics - Placeholder ID */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-placeholder"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-placeholder');
          `}
        </Script>
      </body>
    </html>
  );
}
