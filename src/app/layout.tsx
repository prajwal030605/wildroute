import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  authors: [{ name: "WildRoute", url: "https://wildroute.in" }],
  creator: "WildRoute",
  metadataBase: new URL("https://wildroute.in"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://wildroute.in",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
