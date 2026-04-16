import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TrekCard from "@/components/ui/TrekCard";
import EnquiryForm from "@/components/ui/EnquiryForm";
import { agencies } from "@/data/agencies";
import { treks } from "@/data/treks";
import type { Metadata } from "next";

const activityEmoji: Record<string, string> = {
  trekking: "🥾", rafting: "🚣", paragliding: "🪂", bungee: "🪢",
  camping: "⛺", cycling: "🚵", skiing: "⛷️", "rock-climbing": "🧗",
};

export function generateStaticParams() {
  return agencies.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const agency = agencies.find((a) => a.slug === slug);
  if (!agency) return {};

  const agencyTreks = treks.filter((t) => t.agencyId === agency.id);
  const title = `${agency.name} — Verified Adventure Agency in ${agency.location}`;
  const description = `${agency.description.slice(0, 155)}…`;

  return {
    title,
    description,
    keywords: [
      agency.name,
      `adventure agency ${agency.state}`,
      `trekking agency ${agency.location}`,
      ...agency.activities.map((a) => `${a} ${agency.state}`),
    ],
    openGraph: {
      title: `${agency.name} | WildRoute`,
      description,
      url: `https://wildroute.com/agency/${agency.slug}`,
      images: agency.coverImage
        ? [{ url: agency.coverImage, width: 1200, height: 630, alt: agency.name }]
        : [{ url: "/og-image.png", width: 1200, height: 630, alt: agency.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${agency.name} | WildRoute`,
      description: `${agency.name} offers ${agencyTreks.length} adventures in ${agency.state}. ${agency.verified ? "Verified agency." : ""}`,
      images: agency.coverImage ? [agency.coverImage] : ["/og-image.png"],
    },
    alternates: {
      canonical: `https://wildroute.com/agency/${agency.slug}`,
    },
  };
}

export default async function AgencyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const agency = agencies.find((a) => a.slug === slug);
  if (!agency) return notFound();

  const agencyTreks = treks.filter((t) => t.agencyId === agency.id);
  const startingPrice = agencyTreks.length > 0 ? Math.min(...agencyTreks.map((t) => t.price)) : null;

  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <Navbar />

      {/* Cover */}
      <div style={{
        height: 340, marginTop: 64,
        background: `url(${agency.coverImage}) center/cover no-repeat`,
        position: "relative",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(10,10,10,0.95) 100%)" }} />

        {/* Back */}
        <Link href="/explore?view=agencies" style={{
          position: "absolute", top: 24, left: 24,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
          color: "#fff", padding: "8px 14px", borderRadius: 8, fontSize: 13, textDecoration: "none",
        }}>
          ← Back
        </Link>

        {/* Agency info on cover */}
        <div style={{ position: "absolute", bottom: 28, left: 28, display: "flex", alignItems: "flex-end", gap: 16 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 16, background: "#1D9E75",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "3px solid #0a0a0a", fontSize: 28, fontWeight: 700, color: "#fff",
          }}>
            {agency.name.charAt(0)}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 700, margin: 0 }}>{agency.name}</h1>
              {agency.verified && (
                <span style={{ background: "#0F2A1E", color: "#1D9E75", fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 500 }}>
                  ✓ Verified
                </span>
              )}
            </div>
            <p style={{ color: "#aaa", fontSize: 14, margin: 0 }}>
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
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 32, padding: "20px 24px", background: "#111", border: "1px solid #1a1a1a", borderRadius: 14 }}>
              {[
                { label: "Rating", value: `${agency.rating} ★` },
                { label: "Reviews", value: agency.reviewCount },
                { label: "Treks listed", value: agencyTreks.length },
                { label: "Min price", value: startingPrice ? `₹${startingPrice.toLocaleString("en-IN")}` : "—" },
              ].map((s) => (
                <div key={s.label}>
                  <p style={{ color: "#555", fontSize: 11, marginBottom: 4 }}>{s.label}</p>
                  <p style={{ color: "#1D9E75", fontSize: 18, fontWeight: 700, margin: 0 }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* About */}
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginBottom: 14 }}>About</h2>
              <p style={{ color: "#888", fontSize: 14, lineHeight: 1.8 }}>{agency.description}</p>
            </div>

            {/* Activities */}
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginBottom: 14 }}>Activities offered</h2>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {agency.activities.map((act) => (
                  <span key={act} style={{
                    background: "#0F2A1E", border: "1px solid #1D9E7533", color: "#1D9E75",
                    padding: "8px 16px", borderRadius: 30, fontSize: 13,
                  }}>
                    {activityEmoji[act]} {act.charAt(0).toUpperCase() + act.slice(1)}
                  </span>
                ))}
              </div>
            </div>

            {/* Treks */}
            <div>
              <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginBottom: 20 }}>
                Treks & activities ({agencyTreks.length})
              </h2>
              {agencyTreks.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
                  {agencyTreks.map((trek) => <TrekCard key={trek.id} trek={trek} />)}
                </div>
              ) : (
                <div style={{ padding: "40px", textAlign: "center", background: "#111", borderRadius: 14, border: "1px solid #1a1a1a" }}>
                  <p style={{ color: "#555", fontSize: 14 }}>No treks listed yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ position: "sticky", top: 80 }}>
            {/* Contact card */}
            <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 16, padding: 24, marginBottom: 16 }}>
              <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Contact agency</h3>

              <a href={`mailto:${agency.email}`} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "#1D9E75", color: "#fff", padding: "12px 16px",
                borderRadius: 10, textDecoration: "none", fontSize: 14, fontWeight: 500, marginBottom: 10,
              }}>
                ✉️ Send enquiry
              </a>

              <a href={`tel:${agency.phone}`} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "#0F2A1E", color: "#1D9E75", padding: "12px 16px",
                borderRadius: 10, textDecoration: "none", fontSize: 14, fontWeight: 500,
                border: "1px solid #1D9E7544",
              }}>
                📞 {agency.phone}
              </a>

              {agency.website && (
                <a href={agency.website} target="_blank" rel="noopener noreferrer" style={{
                  display: "block", textAlign: "center", color: "#555", fontSize: 12, marginTop: 12, textDecoration: "none",
                }}>
                  🌐 Visit website →
                </a>
              )}
            </div>

            {/* Enquiry form */}
            <EnquiryForm agencyName={agency.name} agencyEmail={agency.email} />

            {/* Safety card */}
            <div style={{ background: "#0F2A1E", border: "1px solid #1D9E7533", borderRadius: 14, padding: 20 }}>
              <p style={{ color: "#1D9E75", fontSize: 13, fontWeight: 600, marginBottom: 12 }}>✓ Verified agency</p>
              {["GST registered", "Permits verified", "Insurance checked", "Guide certified"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ color: "#1D9E75", fontSize: 12 }}>✓</span>
                  <span style={{ color: "#888", fontSize: 12 }}>{item}</span>
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
