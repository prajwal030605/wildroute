"use client";
import Link from "next/link";
import { Agency } from "@/types";
import { treks } from "@/data/treks";

const activityEmoji: Record<string, string> = {
  trekking: "🥾",
  rafting: "🚣",
  paragliding: "🪂",
  bungee: "🪢",
  camping: "⛺",
  cycling: "🚵",
  skiing: "⛷️",
  "rock-climbing": "🧗",
};

export default function AgencyCard({ agency }: { agency: Agency }) {
  const agencyTreks = treks.filter((t) => t.agencyId === agency.id);
  const startingPrice = agencyTreks.length > 0
    ? Math.min(...agencyTreks.map((t) => t.price))
    : null;

  return (
    <Link href={`/agency/${agency.slug}`} style={{ textDecoration: "none" }}>
      <div style={{
        background: "var(--wr-card)",
        border: "1px solid var(--wr-border)",
        borderRadius: 16, overflow: "hidden",
        transition: "border-color 0.2s, transform 0.2s, background 0.2s",
        cursor: "pointer",
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--wr-green)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--wr-border)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        }}
      >
        {/* Cover */}
        <div style={{
          height: 160, background: `url(${agency.coverImage}) center/cover no-repeat`,
          position: "relative",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.75) 100%)",
          }} />
          {agency.verified && (
            <span style={{
              position: "absolute", top: 12, right: 12,
              background: "var(--wr-green-bg)", color: "var(--wr-green)", fontSize: 11,
              padding: "4px 10px", borderRadius: 20, fontWeight: 500,
            }}>
              ✓ Verified
            </span>
          )}
          <div style={{ position: "absolute", bottom: 12, left: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%", background: "var(--wr-green)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px solid rgba(0,0,0,0.4)",
            }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>
                {agency.name.charAt(0)}
              </span>
            </div>
            <div>
              <p style={{ color: "#fff", fontSize: 14, fontWeight: 600, margin: 0 }}>{agency.name}</p>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, margin: 0 }}>📍 {agency.location}, {agency.state}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "14px 16px" }}>
          {/* Activities */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {agency.activities.map((act) => (
              <span key={act} style={{
                background: "var(--wr-card-hover)",
                color: "var(--wr-text-muted)",
                fontSize: 11, padding: "3px 8px", borderRadius: 6,
              }}>
                {activityEmoji[act]} {act}
              </span>
            ))}
          </div>

          <p style={{
            color: "var(--wr-text-muted)", fontSize: 12, lineHeight: 1.6, marginBottom: 14,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {agency.description}
          </p>

          {/* Stats row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ color: "#F59E0B" }}>★</span>
              <span style={{ color: "var(--wr-text)", fontSize: 14, fontWeight: 600 }}>{agency.rating}</span>
              <span style={{ color: "var(--wr-text-faint)", fontSize: 12 }}>({agency.reviewCount} reviews)</span>
            </div>
            {startingPrice !== null && (
              <div>
                <span style={{ color: "var(--wr-text-faint)", fontSize: 11 }}>from </span>
                <span style={{ color: "var(--wr-green)", fontSize: 14, fontWeight: 700 }}>
                  ₹{startingPrice.toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>

          <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--wr-text-faint)", fontSize: 12 }}>Since {agency.foundedYear} · {agencyTreks.length} treks</span>
            <span style={{ color: "var(--wr-green)", fontSize: 13, fontWeight: 500 }}>View →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
