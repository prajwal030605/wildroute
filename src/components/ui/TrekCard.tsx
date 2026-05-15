"use client";
import Link from "next/link";
import { Trek } from "@/types";
import { agencies } from "@/data/agencies";

const difficultyColor: Record<string, string> = {
  easy: "#1D9E75",
  moderate: "#F59E0B",
  hard: "#EF4444",
  extreme: "#7C3AED",
};

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

export default function TrekCard({ trek }: { trek: Trek }) {
  const agency = agencies.find((a) => a.id === trek.agencyId);

  return (
    <Link href={`/trek/${trek.slug}`} style={{ textDecoration: "none" }}>
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
        {/* Cover image */}
        <div style={{
          height: 180, background: `url(${trek.images[0]}) center/cover no-repeat`,
          position: "relative",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7) 100%)",
          }} />
          {/* Activity badge */}
          <span style={{
            position: "absolute", top: 12, left: 12,
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
            color: "#fff", fontSize: 12, padding: "4px 10px", borderRadius: 20,
          }}>
            {activityEmoji[trek.activityType]} {trek.activityType.charAt(0).toUpperCase() + trek.activityType.slice(1)}
          </span>
          {/* Difficulty */}
          <span style={{
            position: "absolute", top: 12, right: 12,
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
            color: difficultyColor[trek.difficulty], fontSize: 11, padding: "4px 10px", borderRadius: 20,
            textTransform: "capitalize", fontWeight: 500,
          }}>
            {trek.difficulty}
          </span>
          {/* Duration on image */}
          <span style={{ position: "absolute", bottom: 10, left: 12, color: "#ddd", fontSize: 12 }}>
            {trek.duration}
          </span>
        </div>

        {/* Content */}
        <div style={{ padding: "16px" }}>
          <h3 style={{ color: "var(--wr-text)", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{trek.title}</h3>
          <p style={{ color: "var(--wr-text-muted)", fontSize: 12, marginBottom: 12 }}>
            📍 {trek.destination}, {trek.state}
          </p>

          {/* Highlights */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {trek.highlights.slice(0, 2).map((h) => (
              <span key={h} style={{
                background: "var(--wr-green-bg)",
                color: "var(--wr-green)",
                fontSize: 11, padding: "3px 8px", borderRadius: 6,
              }}>
                {h}
              </span>
            ))}
          </div>

          {/* Footer row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ color: "var(--wr-text)", fontSize: 17, fontWeight: 700 }}>₹{trek.price.toLocaleString("en-IN")}</span>
              <span style={{ color: "var(--wr-text-faint)", fontSize: 12 }}> /person</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ color: "#F59E0B", fontSize: 13 }}>★</span>
              <span style={{ color: "var(--wr-text)", fontSize: 13, fontWeight: 500 }}>{trek.rating}</span>
              <span style={{ color: "var(--wr-text-faint)", fontSize: 12 }}>({trek.reviewCount})</span>
            </div>
          </div>

          {/* Agency */}
          {agency && (
            <div style={{
              marginTop: 12, paddingTop: 12,
              borderTop: "1px solid var(--wr-border)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%", background: "var(--wr-green)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ color: "#fff", fontSize: 9, fontWeight: 700 }}>W</span>
              </div>
              <span style={{ color: "var(--wr-text-faint)", fontSize: 12 }}>{agency.name}</span>
              {agency.verified && <span style={{ color: "var(--wr-green)", fontSize: 10 }}>✓ Verified</span>}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
