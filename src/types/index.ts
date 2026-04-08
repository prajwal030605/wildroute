export type ActivityType =
  | "trekking"
  | "rafting"
  | "paragliding"
  | "bungee"
  | "camping"
  | "cycling"
  | "skiing"
  | "rock-climbing";

export type Difficulty = "easy" | "moderate" | "hard" | "extreme";

export interface Agency {
  id: string;
  slug: string;
  name: string;
  location: string;
  state: string;
  description: string;
  logo: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  foundedYear: number;
  activities: ActivityType[];
  email: string;
  phone: string;
  website?: string;
}

export interface Trek {
  id: string;
  agencyId: string;
  title: string;
  slug: string;
  destination: string;
  state: string;
  activityType: ActivityType;
  difficulty: Difficulty;
  duration: string; // e.g. "5 Days / 4 Nights"
  price: number; // INR per person
  maxGroupSize: number;
  minAge: number;
  description: string;
  highlights: string[];
  includes: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  bestSeason: string;
  altitude?: string;
}
