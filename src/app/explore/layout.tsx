import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Adventures",
  description:
    "Browse hundreds of verified treks, camping trips, rafting, paragliding and adventure activities across India. Filter by state, difficulty, price and activity type.",
  keywords: [
    "explore treks India",
    "adventure activities India",
    "best treks India",
    "trekking packages",
    "camping trips India",
    "rafting packages India",
  ],
  openGraph: {
    title: "Explore Adventures | WildRoute",
    description:
      "Browse verified treks, camping, rafting, paragliding and adventure activities across India.",
    url: "https://gowildroute.com/explore",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Explore Adventures on WildRoute" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Adventures | WildRoute",
    description: "Browse verified treks, camping, rafting, and more across India.",
  },
  alternates: {
    canonical: "https://gowildroute.com/explore",
  },
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
