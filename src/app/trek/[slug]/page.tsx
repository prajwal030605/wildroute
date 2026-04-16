import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { treks } from "@/data/treks";
import { agencies } from "@/data/agencies";
import EnquiryForm from "@/components/ui/EnquiryForm";
import type { Metadata } from "next";

const difficultyColor: Record<string, string> = {
  easy: "#1D9E75", moderate: "#F59E0B", hard: "#EF4444", extreme: "#7C3AED",
};
const activityEmoji: Record<string, string> = {
  trekking: "🥾", rafting: "🚣", paragliding: "🪂", bungee: "🪢",
  camping: "⛺", cycling: "🚵", skiing: "⛷️", "rock-climbing": "🧗",
};

export function generateStaticParams() {
  return treks.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const trek = treks.find((t) => t.slug === slug);
  if (!trek) return {};

  const agency = agencies.find((a) => a.id === trek.agencyId);
  const title = `${trek.title} — ${trek.duration} Trek in ${trek.state}`;
  const description = `${trek.description.slice(0, 155)}…`;

  return {
    title,
    description,
    keywords: [
      trek.title,
      `${trek.activityType} ${trek.state}`,
      `trek ${trek.destination}`,
      `${trek.difficulty} trek India`,
      agency?.name ?? "",
    ].filter(Boolean),
    openGraph: {
      title: `${trek.title} | WildRoute`,
      description,
      url: `https://wildroute.com/trek/${trek.slug}`,
      images: trek.images[0]
        ? [{ url: trek.images[0], width: 1200, height: 630, alt: trek.title }]
        : [{ url: "/og-image.png", width: 1200, height: 630, alt: trek.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${trek.title} | WildRoute`,
      description,
      images: trek.images[0] ? [trek.images[0]] : ["/og-image.png"],
    },
    alternates: {
      canonical: `https://wildroute.com/trek/${trek.slug}`,
    },
  };
}

export default async function TrekPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trek = treks.find((t) => t.slug === slug);
  if (!trek) return notFound();

  const agency = agencies.find((a) => a.id === trek.agencyId);

  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <Navbar />

      {/* Hero image */}
      <div style={{ height: 420, marginTop: 64, background: `url(${trek.images[0]}) center/cover no-repeat`, position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(10,10,10,0.95) 100%)" }} />

        <Link href={agency ? `/agency/${agency.slug}` : "/explore"} style={{
          position: "absolute", top: 24, left: 24,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
          color: "#fff", padding: "8px 14px", borderRadius: 8, fontSize: 13, textDecoration: "none",
        }}>
          ← {agency ? agency.name : "Back"}
        </Link>

        <div style={{ position: "absolute", bottom: 32, left: 28, right: 28 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            <span style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", color: "#fff", fontSize: 12, padding: "5px 12px", borderRadius: 20 }}>
              {activityEmoji[trek.activityType]} {trek.activityType.charAt(0).toUpperCase() + trek.activityType.slice(1)}
            </span>
            <span style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", color: difficultyColor[trek.difficulty], fontSize: 12, padding: "5px 12px", borderRadius: 20, textTransform: "capitalize", fontWeight: 500 }}>
              {trek.difficulty}
            </span>
            {trek.altitude && (
              <span style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", color: "#ccc", fontSize: 12, padding: "5px 12px", borderRadius: 20 }}>
                ⛰️ {trek.altitude}
              </span>
            )}
          </div>
          <h1 style={{ color: "#fff", fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 800, margin: "0 0 8px", maxWidth: 700 }}>{trek.title}</h1>
          <p style={{ color: "#aaa", fontSize: 15, margin: 0 }}>📍 {trek.destination}, {trek.state}</p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 36, alignItems: "flex-start" }}>

          {/* Left: main content */}
          <div>
            {/* Quick stats bar */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 1, background: "#1a1a1a", borderRadius: 14, overflow: "hidden", marginBottom: 36 }}>
              {[
                { label: "Duration", value: trek.duration },
                { label: "Price", value: `₹${trek.price.toLocaleString("en-IN")}` },
                { label: "Group size", value: `Max ${trek.maxGroupSize}` },
                { label: "Min age", value: `${trek.minAge}+` },
                { label: "Best season", value: trek.bestSeason },
              ].map((s) => (
                <div key={s.label} style={{ background: "#111", padding: "16px 20px", textAlign: "center" }}>
                  <p style={{ color: "#555", fontSize: 11, margin: "0 0 5px" }}>{s.label}</p>
                  <p style={{ color: "#1D9E75", fontSize: 14, fontWeight: 700, margin: 0 }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* About */}
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 14 }}>About this trek</h2>
              <p style={{ color: "#888", fontSize: 14, lineHeight: 1.9 }}>{trek.description}</p>
            </div>

            {/* Highlights */}
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Highlights</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
                {trek.highlights.map((h) => (
                  <div key={h} style={{ background: "#0F2A1E", border: "1px solid #1D9E7533", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ color: "#1D9E75", fontSize: 14 }}>✓</span>
                    <span style={{ color: "#ccc", fontSize: 13 }}>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What's included */}
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>What&apos;s included</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {trek.includes.map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #111" }}>
                    <span style={{ color: "#1D9E75", fontSize: 16 }}>✓</span>
                    <span style={{ color: "#888", fontSize: 14 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#F59E0B", fontSize: 36, fontWeight: 800, margin: 0 }}>{trek.rating}</p>
                <p style={{ color: "#555", fontSize: 12, margin: "4px 0 0" }}>out of 5</p>
              </div>
              <div>
                <div style={{ display: "flex", gap: 2, marginBottom: 4 }}>
                  {[1,2,3,4,5].map((s) => (
                    <span key={s} style={{ color: s <= Math.round(trek.rating) ? "#F59E0B" : "#333", fontSize: 18 }}>★</span>
                  ))}
                </div>
                <p style={{ color: "#555", fontSize: 13, margin: 0 }}>Based on {trek.reviewCount} reviews</p>
              </div>
            </div>
          </div>

          {/* Right: sticky sidebar */}
          <div style={{ position: "sticky", top: 84 }}>
            {/* Price card */}
            <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 16, padding: 24, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <span style={{ color: "#555", fontSize: 12 }}>Starting from</span>
                  <p style={{ color: "#fff", fontSize: 28, fontWeight: 800, margin: "4px 0 0" }}>
                    ₹{trek.price.toLocaleString("en-IN")}
                  </p>
                  <span style={{ color: "#555", fontSize: 12 }}>per person</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ color: "#F59E0B" }}>★</span>
                  <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{trek.rating}</span>
                  <span style={{ color: "#555", fontSize: 12 }}>({trek.reviewCount})</span>
                </div>
              </div>

              {agency && (
                <Link href={`/agency/${agency.slug}`} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 14px", background: "#1D9E75", borderRadius: 10,
                  textDecoration: "none", marginBottom: 10,
                }}>
                  <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>Book with {agency.name} →</span>
                </Link>
              )}

              <p style={{ color: "#444", fontSize: 11, textAlign: "center", marginTop: 8 }}>
                Free cancellation · Secure payment
              </p>
            </div>

            {/* Agency card */}
            {agency && (
              <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 16, padding: 20, marginBottom: 16 }}>
                <p style={{ color: "#888", fontSize: 11, marginBottom: 12 }}>OPERATED BY</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "#1D9E75", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16 }}>
                    {agency.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ color: "#fff", fontSize: 14, fontWeight: 600, margin: 0 }}>{agency.name}</p>
                    <p style={{ color: "#555", fontSize: 12, margin: 0 }}>📍 {agency.location}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
                  <div><p style={{ color: "#555", fontSize: 11, margin: "0 0 2px" }}>Rating</p><p style={{ color: "#F59E0B", fontSize: 14, fontWeight: 700, margin: 0 }}>{agency.rating} ★</p></div>
                  <div><p style={{ color: "#555", fontSize: 11, margin: "0 0 2px" }}>Reviews</p><p style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: 0 }}>{agency.reviewCount}</p></div>
                  {agency.verified && <div><p style={{ color: "#555", fontSize: 11, margin: "0 0 2px" }}>Status</p><p style={{ color: "#1D9E75", fontSize: 13, fontWeight: 600, margin: 0 }}>✓ Verified</p></div>}
                </div>
                <Link href={`/agency/${agency.slug}`} style={{ display: "block", textAlign: "center", color: "#1D9E75", fontSize: 13, textDecoration: "none" }}>
                  View agency profile →
                </Link>
              </div>
            )}

            {/* Enquiry form */}
            <EnquiryForm trekTitle={trek.title} agencyEmail={agency?.email} />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
