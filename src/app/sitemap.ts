import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blogs";
import { supabase } from "@/lib/supabase";

const BASE_URL = "https://gowildroute.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/explore`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/list-your-agency`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/register/agency`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Trek pages — fetch live slugs from Supabase
  let trekPages: MetadataRoute.Sitemap = [];
  try {
    const { data: trekRows } = await supabase
      .from("agency_treks")
      .select("trek_slug, updated_at")
      .not("trek_slug", "is", null);

    if (trekRows) {
      trekPages = trekRows.map((row) => ({
        url: `${BASE_URL}/trek/${row.trek_slug}`,
        lastModified: row.updated_at ? new Date(row.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch {
    // Fallback: no trek pages if Supabase is unreachable
  }

  // Agency pages — fetch live slugs from Supabase
  let agencyPages: MetadataRoute.Sitemap = [];
  try {
    const { data: agencyRows } = await supabase
      .from("agencies_directory")
      .select("slug, updated_at")
      .eq("verified", true)
      .not("slug", "is", null);

    if (agencyRows) {
      agencyPages = agencyRows.map((row) => ({
        url: `${BASE_URL}/agency/${row.slug}`,
        lastModified: row.updated_at ? new Date(row.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch {
    // Fallback: no agency pages if Supabase is unreachable
  }

  // Blog post pages — static data
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...trekPages, ...agencyPages, ...blogPages];
}
