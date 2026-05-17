/**
 * Maps raw Supabase rows (snake_case) into the Agency / Trek types used
 * throughout the app. Import from here — never import from @/data/agencies
 * or @/data/treks for dynamic content.
 */
import type { Agency, Trek, ActivityType, Difficulty } from "@/types";

type AnyRow = Record<string, unknown>;

export function mapAgency(row: AnyRow): Agency {
  return {
    id: String(row.registration_id || row.id || ""),
    slug: String(row.slug || ""),
    name: String(row.agency_name || row.name || ""),
    location: String(row.location || ""),
    state: String(row.state_name || row.state || ""),
    description: String(row.agency_description || row.description || ""),
    logo: String(row.logo || "/WildRoute_PFP_Tilted.png"),
    coverImage: String(row.cover_image || ""),
    rating: Number(row.rating) || 4.5,
    reviewCount: Number(row.review_count) || 0,
    verified: Boolean(row.verified),
    foundedYear: Number(row.founded_year) || new Date().getFullYear(),
    activities: (Array.isArray(row.activities) ? row.activities : []) as ActivityType[],
    email: String(row.email || ""),
    phone: String(row.phone || ""),
    website: row.website ? String(row.website) : undefined,
  };
}

export function mapTrek(trekRow: AnyRow, agencyRow?: AnyRow | null): Trek {
  const photos = Array.isArray(trekRow.trek_photos)
    ? (trekRow.trek_photos as string[]).filter(Boolean)
    : [];
  const inclusions = Array.isArray(trekRow.inclusions)
    ? (trekRow.inclusions as string[]).filter(Boolean)
    : [];
  const seasons = Array.isArray(trekRow.season)
    ? (trekRow.season as string[])
    : [];
  const activities = (
    agencyRow && Array.isArray(agencyRow.activities) ? agencyRow.activities : []
  ) as ActivityType[];

  return {
    id: String(trekRow.registration_id || ""),
    agencyId: String(agencyRow?.registration_id || agencyRow?.id || ""),
    agencyName: agencyRow ? String(agencyRow.agency_name || agencyRow.name || "") : undefined,
    title: String(trekRow.trek_name || ""),
    slug: String(trekRow.trek_slug || ""),
    destination: String(trekRow.trek_area || agencyRow?.location || "India"),
    state: String(agencyRow?.state || ""),
    activityType: (activities[0] as ActivityType) || "trekking",
    difficulty: (String(trekRow.difficulty || "moderate")) as Difficulty,
    duration: String(trekRow.trek_duration || ""),
    price: Number(trekRow.price_per_person) || 0,
    maxGroupSize: 20,
    minAge: 14,
    description: String(trekRow.trek_description || ""),
    highlights: [],
    includes: inclusions,
    images:
      photos.length > 0
        ? photos
        : ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format"],
    rating: Number(agencyRow?.rating) || 4.5,
    reviewCount: Number(agencyRow?.review_count) || 0,
    bestSeason: seasons.length > 0 ? seasons[0] : "Spring",
    altitude: trekRow.trek_altitude ? String(trekRow.trek_altitude) : undefined,
  };
}
