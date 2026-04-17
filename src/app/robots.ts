import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/explore", "/blog", "/trek/", "/agency/"],
        disallow: ["/admin", "/register/agency/onboarding", "/api/", "/login"],
      },
    ],
    sitemap: "https://wildroute.com/sitemap.xml",
    host: "https://wildroute.com",
  };
}
