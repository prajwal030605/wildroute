import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TrekCard from "@/components/ui/TrekCard";
import EnquiryForm from "@/components/ui/EnquiryForm";
import { supabase } from "@/lib/supabase";
import { mapAgency, mapTrek } from "@/lib/supabase-data";

const activityEmoji: Record<string, string> = {
  trekking: "🥾", rafting: "🚣", paragliding: "🪂", bungee: "🪢",
  camping: "⛺", cycling: "🚵", skiing: "⛷️", "rock-climbing": "🧗",
};

import type { Metadata } from "next";

const BASE_URL = "https://gowildroute.com";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const { data: row } = await supabase
    .from("agencies_directory")
    .select("agency_name, agency_description, cover_image, location, state_name")
    .eq("slug", slug)
    .eq("verified", true)
    .maybeSingle();

  if (!row) return {};
  const title = `${row.agency_name} — Adventure Agency | WildRoute`;
  const description = row.agency_description?.slice(0, 155) || `Book verified treks and adventures with ${row.agency_name} in ${row.location}, ${row.state_name} on WildRoute.`;
  const image = row.cover_image || `${BASE_URL}/og-image.png`;
  const url = `${BASE_URL}/agency/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: row.agency_name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export const dynamic = "force-dynamic";

export default async function AgencyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: agencyRow } = await supabase
    .from("agencies_directory")
    .select("*")
    .eq("slug", slug)
    .eq("verified", true)
    .maybeSingle();

  if (!agencyRow) return notFound();

  const { data: trekRows } = await supabase
    .from("agency_treks")
    .select("*")
    .eq("agency_email", String(agencyRow.email))
    .order("created_at", { ascending: false });

  const agency = mapAgency(agencyRow);
  const agencyTreks = (trekRows || []).map(row => mapTrek(row, agencyRow));
  const startingPrice = agencyTreks.length > 0 ? Math.min(...agencyTreks.map((t) => t.price)) : null;

  return (
    <main style={{ background: "var(--wr-bg)", minHeight: "100vh", fontFamily: "sans-serif", transition: "background 0.2s" }}>
      <Navbar />

      {/* Cover */}
      <div style={{
        height: 340, marginTop: 64,
        background: `url(${agency.coverImage}) center/cover no-repeat`,
        position: "relative",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(10,10,10,0.95) 100%)" }} />

        <Link href="/explore?view=agencies" style={{
          position: "absolute", top: 24, left: 24,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
          color: "#fff", padding: "8px 14px", borderRadius: 8, fontSize: 13, textDecoration: "none",
        }}>
          ← Back
        </Link>

        <div style={{ position: "absolute", bottom: 28, left: 28, display: "flex", alignItems: "flex-end", gap: 16 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 16, background: "var(--wr-green)",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "3px solid rgba(0,0,0,0.5)", fontSize: 28, fontWeight: 700, color: "#fff",
          }}>
            {agency.name.charAt(0)}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 700, margin: 0 }}>{agency.name}</h1>
              {agency.verified && (
                <span style={{ background: "rgba(15,42,30,0.9)", color: "#1D9E75", fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 500 }}>
                  ✓ Verified
                </span>
              )}
            </div>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, margin: 0 }}>
              📍 {agency.location}, {agency.state} · Since {agency.foundedYear}
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 32, alignItems: "flex-start" }}>

          {/* Main content */}
          <div>
            {/* Quick stats */}
            <div style={{
              display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 32, padding: "20px 24px",
              background: "var(--wr-card)", border: "1px solid var(--wr-border)", borderRadius: 14,
              transition: "background 0.2s, border-color 0.2s",
            }}>
              {[
                { label: "Rating", value: `${agency.rating} ★` },
                { label: "Reviews", value: agency.reviewCount },
                { label: "Treks listed", value: agencyTreks.length },
                { label: "Min price", value: startingPrice ? `₹${startingPrice.toLocaleString("en-IN")}` : "—" },
              ].map((s) => (
                <div key={s.label}>
                  <p style={{ color: "var(--wr-text-faint)", fontSize: 11, marginBottom: 4 }}>{s.label}</p>
                  <p style={{ color: "var(--wr-green)", fontSize: 18, fontWeight: 700, margin: 0 }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* About */}
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ color: "var(--wr-text)", fontSize: 18, fontWeight: 600, marginBottom: 14 }}>About</h2>
              <p style={{ color: "var(--wr-text-muted)", fontSize: 14, lineHeight: 1.8 }}>{agency.description}</p>
            </div>

            {/* Activities */}
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ color: "var(--wr-text)", fontSize: 18, fontWeight: 600, marginBottom: 14 }}>Activities offered</h2>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {agency.activities.map((act) => (
                  <span key={act} style={{
                    background: "var(--wr-green-bg)", border: "1px solid var(--wr-green-border)",
                    color: "var(--wr-green)", padding: "8px 16px", borderRadius: 30, fontSize: 13,
                  }}>
                    {activityEmoji[act]} {act.charAt(0).toUpperCase() + act.slice(1)}
                  </span>
                ))}
              </div>
            </div>

            {/* Treks */}
            <div>
              <h2 style={{ color: "var(--wr-text)", fontSize: 18, fontWeight: 600, marginBottom: 20 }}>
                Treks & activities ({agencyTreks.length})
              </h2>
              {agencyTreks.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
                  {agencyTreks.map((trek) => <TrekCard key={trek.id} trek={trek} />)}
                </div>
              ) : (
                <div style={{
                  padding: "40px", textAlign: "center",
                  background: "var(--wr-card)", borderRadius: 14, border: "1px solid var(--wr-border)",
                }}>
                  <p style={{ color: "var(--wr-text-faint)", fontSize: 14 }}>No treks listed yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ position: "sticky", top: 80 }}>
            {/* Contact card */}
            <div style={{
              background: "var(--wr-card)", border: "1px solid var(--wr-border)",
              borderRadius: 16, padding: 24, marginBottom: 16,
              transition: "background 0.2s, border-color 0.2s",
            }}>
              <h3 style={{ color: "var(--wr-text)", fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Contact agency</h3>

              <a href={`mailto:${agency.email}`} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "var(--wr-green)", color: "#fff", padding: "12px 16px",
                borderRadius: 10, textDecoration: "none", fontSize: 14, fontWeight: 500, marginBottom: 10,
              }}>
                ✉️ Send enquiry
              </a>

              <a href={`tel:${agency.phone}`} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "var(--wr-green-bg)", color: "var(--wr-green)", padding: "12px 16px",
                borderRadius: 10, textDecoration: "none", fontSize: 14, fontWeight: 500,
                border: "1px solid var(--wr-green-border)",
              }}>
                📞 {agency.phone}
              </a>

              {agency.website && (
                <a href={agency.website} target="_blank" rel="noopener noreferrer" style={{
                  display: "block", textAlign: "center", color: "var(--wr-text-faint)", fontSize: 12, marginTop: 12, textDecoration: "none",
                }}>
                  🌐 Visit website →
                </a>
              )}
            </div>

            {/* Enquiry form */}
            <EnquiryForm agencyName={agency.name} agencyEmail={agency.email} />

            {/* Safety card */}
            <div style={{
              background: "var(--wr-green-bg)", border: "1px solid var(--wr-green-border)",
              borderRadius: 14, padding: 20, marginTop: 16,
            }}>
              <p style={{ color: "var(--wr-green)", fontSize: 13, fontWeight: 600, marginBottom: 12 }}>✓ Verified agency</p>
              {["GST registered", "Permits verified", "Insurance checked", "Guide certified"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ color: "var(--wr-green)", fontSize: 12 }}>✓</span>
                  <span style={{ color: "var(--wr-text-muted)", fontSize: 12 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
