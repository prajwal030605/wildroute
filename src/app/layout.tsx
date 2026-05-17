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
        {/* Floating WhatsApp support button */}
        <a
          href="https://wa.me/918273820633?text=Hi%20WildRoute%2C%20I%20need%20help%20with%20booking%20an%20adventure."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with WildRoute support on WhatsApp"
          style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 9999,
            width: 56, height: 56, borderRadius: "50%",
            background: "#25D366", boxShadow: "0 4px 20px rgba(37,211,102,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            textDecoration: "none", transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.1)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 28px rgba(37,211,102,0.6)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 20px rgba(37,211,102,0.4)";
          }}
        >
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.832 6.5L4 29l7.7-1.808A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/>
            <path d="M21.5 18.5c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51-.17-.01-.37-.01-.57-.01s-.52.07-.8.37c-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" fill="#25D366"/>
          </svg>
        </a>
      </body>
    </html>
  );
}
