export type WildRouteRole = "admin" | "user" | "agency";

export type WildRouteSession = {
  role: WildRouteRole;
  email: string;
};

const STORAGE_KEY = "wildroute_session";

export function getSession(): WildRouteSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (
      parsed &&
      typeof parsed === "object" &&
      "role" in parsed &&
      "email" in parsed &&
      (parsed.role === "admin" || parsed.role === "user" || parsed.role === "agency") &&
      typeof (parsed as WildRouteSession).email === "string"
    ) {
      return parsed as WildRouteSession;
    }
    return null;
  } catch {
    return null;
  }
}

export function setSession(session: WildRouteSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/** Returns role if credentials match env-configured admin or user accounts. */
export function resolveRoleFromCredentials(
  email: string,
  password: string
): WildRouteRole | null {
  const em = email.trim().toLowerCase();
  const adminEmail = (
    process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@wildroute.local"
  ).toLowerCase();
  const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "";
  if (em === adminEmail && password === adminPass) return "admin";

  const userEmail = (
    process.env.NEXT_PUBLIC_USER_EMAIL || "user@wildroute.local"
  ).toLowerCase();
  const userPass = process.env.NEXT_PUBLIC_USER_PASSWORD || "";
  if (userPass && em === userEmail && password === userPass) return "user";

  const agencyEmail = (
    process.env.NEXT_PUBLIC_AGENCY_EMAIL || "agency@wildroute.local"
  ).toLowerCase();
  const agencyPass = process.env.NEXT_PUBLIC_AGENCY_PASSWORD || "";
  if (agencyPass && em === agencyEmail && password === agencyPass) return "agency";

  return null;
}
