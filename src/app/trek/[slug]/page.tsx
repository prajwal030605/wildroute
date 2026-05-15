import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EnquiryForm from "@/components/ui/EnquiryForm";
import { supabase } from "@/lib/supabase";
import { mapAgency, mapTrek } from "@/lib/supabase-data";

const difficultyColor: Record<string, string> = {
  easy: "#1D9E75", moderate: "#F59E0B", hard: "#EF4444", extreme: "#7C3AED",
};
const activityEmoji: Record<string, string> = {
  trekking: "🥾", rafting: "🚣", paragliding: "🪂", bungee: "🪢",
  camping: "⛺", cycling: "🚵", skiing: "⛷️", "rock-climbing": "🧗",
};

export const dynamic = "force-dynamic";

export default async function TrekPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: trekRow } = await supabase
    .from("agency_treks")
    .select("*")
    .eq("trek_slug", slug)
    .maybeSingle();

  if (!trekRow) return notFound();

  const { data: agencyRow } = await supabase
    .from("agencies_directory")
    .select("*")
    .eq("email", String(trekRow.agency_email))
    .eq("verified", true)
    .maybeSingle();

  if (!agencyRow) return notFound();

  const trek = mapTrek(trekRow, agencyRow);
  const agency = mapAgency(agencyRow);

  return (
    <main style={{ background: "var(--wr-bg)", minHeight: "100vh", fontFamily: "sans-serif", transition: "background 0.2s" }}>
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
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, margin: 0 }}>📍 {trek.destination}, {trek.state}</p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 36, alignItems: "flex-start" }}>

          {/* Left: main content */}
          <div>
            {/* Quick stats bar */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: 1, background: "var(--wr-border)", borderRadius: 14, overflow: "hidden", marginBottom: 36,
            }}>
              {[
                { label: "Duration", value: trek.duration },
                { label: "Price", value: `₹${trek.price.toLocaleString("en-IN")}` },
                { label: "Group size", value: `Max ${trek.maxGroupSize}` },
                { label: "Min age", value: `${trek.minAge}+` },
                { label: "Best season", value: trek.bestSeason },
              ].map((s) => (
                <div key={s.label} style={{ background: "var(--wr-card)", padding: "16px 20px", textAlign: "center" }}>
                  <p style={{ color: "var(--wr-text-faint)", fontSize: 11, margin: "0 0 5px" }}>{s.label}</p>
                  <p style={{ color: "var(--wr-green)", fontSize: 14, fontWeight: 700, margin: 0 }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* About */}
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ color: "var(--wr-text)", fontSize: 18, fontWeight: 700, marginBottom: 14 }}>About this trek</h2>
              <p style={{ color: "var(--wr-text-muted)", fontSize: 14, lineHeight: 1.9 }}>{trek.description}</p>
            </div>

            {/* Highlights */}
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ color: "var(--wr-text)", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Highlights</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
                {trek.highlights.map((h) => (
                  <div key={h} style={{
                    background: "var(--wr-green-bg)", border: "1px solid var(--wr-green-border)",
                    borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10,
                  }}>
                    <span style={{ color: "var(--wr-green)", fontSize: 14 }}>✓</span>
                    <span style={{ color: "var(--wr-text-2)", fontSize: 13 }}>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Included */}
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ color: "var(--wr-text)", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>What&apos;s included</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {trek.includes.map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--wr-border)" }}>
                    <span style={{ color: "var(--wr-green)", fontSize: 16 }}>✓</span>
                    <span style={{ color: "var(--wr-text-muted)", fontSize: 14 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div style={{ background: "var(--wr-card)", border: "1px solid var(--wr-border)", borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#F59E0B", fontSize: 36, fontWeight: 800, margin: 0 }}>{trek.rating}</p>
                <p style={{ color: "var(--wr-text-faint)", fontSize: 12, margin: "4px 0 0" }}>out of 5</p>
              </div>
              <div>
                <div style={{ display: "flex", gap: 2, marginBottom: 4 }}>
                  {[1,2,3,4,5].map((s) => (
                    <span key={s} style={{ color: s <= Math.round(trek.rating) ? "#F59E0B" : "var(--wr-border-strong)", fontSize: 18 }}>★</span>
                  ))}
                </div>
                <p style={{ color: "var(--wr-text-faint)", fontSize: 13, margin: 0 }}>Based on {trek.reviewCount} reviews</p>
              </div>
            </div>
          </div>

          {/* Right: sticky sidebar */}
          <div style={{ position: "sticky", top: 84 }}>
            {/* Price card */}
            <div style={{ background: "var(--wr-card)", border: "1px solid var(--wr-border)", borderRadius: 16, padding: 24, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <span style={{ color: "var(--wr-text-faint)", fontSize: 12 }}>Starting from</span>
                  <p style={{ color: "var(--wr-text)", fontSize: 28, fontWeight: 800, margin: "4px 0 0" }}>
                    ₹{trek.price.toLocaleString("en-IN")}
                  </p>
                  <span style={{ color: "var(--wr-text-faint)", fontSize: 12 }}>per person</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ color: "#F59E0B" }}>★</span>
                  <span style={{ color: "var(--wr-text)", fontSize: 14, fontWeight: 600 }}>{trek.rating}</span>
                  <span style={{ color: "var(--wr-text-faint)", fontSize: 12 }}>({trek.reviewCount})</span>
                </div>
              </div>

              {agency && (
                <Link href={`/agency/${agency.slug}`} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 14px", background: "var(--wr-green)", borderRadius: 10,
                  textDecoration: "none", marginBottom: 10,
                }}>
                  <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>Book with {agency.name} →</span>
                </Link>
              )}

              <p style={{ color: "var(--wr-text-faint)", fontSize: 11, textAlign: "center", marginTop: 8 }}>
                Free cancellation · Secure payment
              </p>
            </div>

            {/* Agency card */}
            {agency && (
              <div style={{ background: "var(--wr-card)", border: "1px solid var(--wr-border)", borderRadius: 16, padding: 20, marginBottom: 16 }}>
                <p style={{ color: "var(--wr-text-faint)", fontSize: 11, marginBottom: 12 }}>OPERATED BY</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--wr-green)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16 }}>
                    {agency.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ color: "var(--wr-text)", fontSize: 14, fontWeight: 600, margin: 0 }}>{agency.name}</p>
                    <p style={{ color: "var(--wr-text-faint)", fontSize: 12, margin: 0 }}>📍 {agency.location}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
                  <div><p style={{ color: "var(--wr-text-faint)", fontSize: 11, margin: "0 0 2px" }}>Rating</p><p style={{ color: "#F59E0B", fontSize: 14, fontWeight: 700, margin: 0 }}>{agency.rating} ★</p></div>
                  <div><p style={{ color: "var(--wr-text-faint)", fontSize: 11, margin: "0 0 2px" }}>Reviews</p><p style={{ color: "var(--wr-text)", fontSize: 14, fontWeight: 700, margin: 0 }}>{agency.reviewCount}</p></div>
                  {agency.verified && <div><p style={{ color: "var(--wr-text-faint)", fontSize: 11, margin: "0 0 2px" }}>Status</p><p style={{ color: "var(--wr-green)", fontSize: 13, fontWeight: 600, margin: 0 }}>✓ Verified</p></div>}
                </div>
                <Link href={`/agency/${agency.slug}`} style={{ display: "block", textAlign: "center", color: "var(--wr-green)", fontSize: 13, textDecoration: "none" }}>
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
