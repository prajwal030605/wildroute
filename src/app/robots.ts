import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/explore", "/blog", "/trek/", "/agency/", "/list-your-agency"],
        disallow: ["/admin", "/register/agency/onboarding", "/api/", "/login"],
      },
    ],
    sitemap: "https://gowildroute.com/sitemap.xml",
    host: "https://gowildroute.com",
  };
}
