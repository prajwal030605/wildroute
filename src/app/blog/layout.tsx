import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Trek Smarter",
  description:
    "Honest trek guides, cost breakdowns, safety tips, and everything you need to plan your next Indian adventure. Written by experienced trekkers.",
  keywords: [
    "trek blog India",
    "trekking tips India",
    "trek cost guide",
    "adventure travel blog",
    "Himalayan trek guide",
    "trekking safety tips",
  ],
  openGraph: {
    title: "Blog — Trek Smarter | WildRoute",
    description:
      "Honest guides, cost breakdowns, safety tips and everything you need to plan your next Indian adventure.",
    url: "https://wildroute.com/blog",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "WildRoute Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Trek Smarter | WildRoute",
    description: "Honest trek guides, cost breakdowns and safety tips for Indian adventures.",
  },
  alternates: {
    canonical: "https://wildroute.com/blog",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
