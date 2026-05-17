import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import ThemeProvider from "@/components/providers/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "WildRoute — Your Route to Real Adventure",
    template: "%s | WildRoute",
  },
  description:
    "Discover and book verified treks, camping, rafting, paragliding, and adventure experiences across India. WildRoute connects you with trusted local agencies.",
  keywords: [
    "trekking India",
    "adventure travel India",
    "book trek online",
    "camping India",
    "rafting India",
    "paragliding India",
    "Himalayan treks",
    "Uttarakhand trekking",
    "Himachal Pradesh treks",
    "adventure agencies India",
    "WildRoute",
  ],
  authors: [{ name: "WildRoute", url: "https://gowildroute.com" }],
  creator: "WildRoute",
  metadataBase: new URL("https://gowildroute.com"),
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48 32x32 16x16", type: "image/x-icon" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://gowildroute.com",
    siteName: "WildRoute",
    title: "WildRoute — Your Route to Real Adventure",
    description:
      "Discover and book verified treks, camping, rafting, paragliding, and adventure experiences across India.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WildRoute — India's Adventure Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WildRoute — Your Route to Real Adventure",
    description:
      "Discover and book verified treks, camping, rafting, and adventure experiences across India.",
    images: ["/og-image.png"],
    creator: "@wildroute_in",
  },
  alternates: {
    canonical: "https://gowildroute.com",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Prevent flash of wrong theme on page load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('wr-theme');if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');}}catch(e){}})();`,
          }}
        />
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-53XYH9LJLT"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-53XYH9LJLT');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
