"use client";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TrekCard from "@/components/ui/TrekCard";
import AgencyCard from "@/components/ui/AgencyCard";
import { treks } from "@/data/treks";
import { agencies } from "@/data/agencies";
import { ActivityType } from "@/types";

const activityFilters = [
  { label: "All", value: "" },
  { label: "🥾 Trekking", value: "trekking" },
  { label: "🚣 Rafting", value: "rafting" },
  { label: "🪂 Paragliding", value: "paragliding" },
  { label: "🪢 Bungee", value: "bungee" },
  { label: "⛺ Camping", value: "camping" },
  { label: "🚵 Cycling", value: "cycling" },
];

const difficultyFilters = [
  { label: "Any level", value: "" },
  { label: "Easy", value: "easy" },
  { label: "Moderate", value: "moderate" },
  { label: "Hard", value: "hard" },
  { label: "Extreme", value: "extreme" },
];

const stateFilters = [
  "All states",
  "Uttarakhand",
  "Himachal Pradesh",
  "Ladakh",
  "Meghalaya",
  "Sikkim",
];

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") || "";
  const initialQ = searchParams.get("q") || "";
  const initialView = searchParams.get("view") || "treks";

  const [view, setView] = useState<"treks" | "agencies">(initialView as "treks" | "agencies");
  const [query, setQuery] = useState(initialQ);
  const [activityFilter, setActivityFilter] = useState(initialType);
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("All states");
  const [maxPrice, setMaxPrice] = useState(50000);
  const [sortBy, setSortBy] = useState<"rating" | "price_asc" | "price_desc">("rating");

  const filteredTreks = useMemo(() => {
    let result = [...treks];
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || t.destination.toLowerCase().includes(q) || t.state.toLowerCase().includes(q)
      );
    }
    if (activityFilter) result = result.filter((t) => t.activityType === activityFilter as ActivityType);
    if (difficultyFilter) result = result.filter((t) => t.difficulty === difficultyFilter);
    if (stateFilter !== "All states") result = result.filter((t) => t.state === stateFilter);
    result = result.filter((t) => t.price <= maxPrice);
    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    if (sortBy === "price_asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") result.sort((a, b) => b.price - a.price);
    return result;
  }, [query, activityFilter, difficultyFilter, stateFilter, maxPrice, sortBy]);

  const filteredAgencies = useMemo(() => {
    let result = [...agencies];
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (a) => a.name.toLowerCase().includes(q) || a.location.toLowerCase().includes(q) || a.state.toLowerCase().includes(q)
      );
    }
    if (activityFilter) result = result.filter((a) => a.activities.includes(activityFilter as ActivityType));
    if (stateFilter !== "All states") result = result.filter((a) => a.state === stateFilter);
    result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [query, activityFilter, stateFilter]);

  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <Navbar />

      {/* Header */}
      <section style={{ paddingTop: 88, background: "#0a0a0a", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 0" }}>
          <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Explore adventures</h1>
          <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
            {filteredTreks.length} treks · {filteredAgencies.length} agencies across India
          </p>

          {/* Search bar */}
          <div style={{
            display: "flex", background: "#111", border: "1px solid #222",
            borderRadius: 12, overflow: "hidden", maxWidth: 560, marginBottom: 24,
          }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search treks, destinations..."
              style={{ flex: 1, background: "transparent", border: "none", padding: "13px 16px", fontSize: 14, color: "#fff", outline: "none" }}
            />
            {query && (
              <button onClick={() => setQuery("")} style={{ background: "none", border: "none", color: "#555", padding: "0 14px", cursor: "pointer", fontSize: 16 }}>✕</button>
            )}
          </div>

          {/* View toggle */}
          <div style={{ display: "flex", gap: 0, marginBottom: 0, border: "1px solid #222", borderRadius: 10, overflow: "hidden", width: "fit-content" }}>
            <button onClick={() => setView("treks")} style={{ padding: "8px 20px", fontSize: 13, cursor: "pointer", border: "none", background: view === "treks" ? "#1D9E75" : "transparent", color: view === "treks" ? "#fff" : "#666", fontWeight: 500 }}>
              Treks & Activities
            </button>
            <button onClick={() => setView("agencies")} style={{ padding: "8px 20px", fontSize: 13, cursor: "pointer", border: "none", background: view === "agencies" ? "#1D9E75" : "transparent", color: view === "agencies" ? "#fff" : "#666", fontWeight: 500 }}>
              Agencies
            </button>
          </div>
        </div>

        {/* Activity filter pills */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px", display: "flex", gap: 8, overflowX: "auto" }}>
          {activityFilters.map((f) => (
            <button key={f.value} onClick={() => setActivityFilter(f.value)} style={{
              padding: "7px 16px", borderRadius: 30, fontSize: 12, cursor: "pointer", fontWeight: 500,
              border: activityFilter === f.value ? "1px solid #1D9E75" : "1px solid #222",
              background: activityFilter === f.value ? "#0F2A1E" : "#111",
              color: activityFilter === f.value ? "#1D9E75" : "#666",
              whiteSpace: "nowrap",
            }}>
              {f.label}
            </button>
          ))}
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px", display: "flex", gap: 28, alignItems: "flex-start" }}>
        {/* Sidebar filters */}
        <aside style={{
          width: 220, flexShrink: 0, position: "sticky", top: 80,
          background: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: 14, padding: 20,
        }}>
          <p style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Filters</p>

          {/* Difficulty */}
          {view === "treks" && (
            <div style={{ marginBottom: 24 }}>
              <p style={{ color: "#888", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 10 }}>DIFFICULTY</p>
              {difficultyFilters.map((f) => (
                <button key={f.value} onClick={() => setDifficultyFilter(f.value)} style={{
                  display: "block", width: "100%", textAlign: "left", padding: "7px 10px",
                  borderRadius: 8, fontSize: 13, cursor: "pointer", border: "none", marginBottom: 4,
                  background: difficultyFilter === f.value ? "#0F2A1E" : "transparent",
                  color: difficultyFilter === f.value ? "#1D9E75" : "#666",
                }}>
                  {f.label}
                </button>
              ))}
            </div>
          )}

          {/* State */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ color: "#888", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 10 }}>STATE</p>
            {stateFilters.map((s) => (
              <button key={s} onClick={() => setStateFilter(s)} style={{
                display: "block", width: "100%", textAlign: "left", padding: "7px 10px",
                borderRadius: 8, fontSize: 13, cursor: "pointer", border: "none", marginBottom: 4,
                background: stateFilter === s ? "#0F2A1E" : "transparent",
                color: stateFilter === s ? "#1D9E75" : "#666",
              }}>
                {s}
              </button>
            ))}
          </div>

          {/* Price range */}
          {view === "treks" && (
            <div style={{ marginBottom: 24 }}>
              <p style={{ color: "#888", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 10 }}>MAX PRICE</p>
              <p style={{ color: "#1D9E75", fontSize: 14, fontWeight: 700, marginBottom: 8 }}>₹{maxPrice.toLocaleString("en-IN")}</p>
              <input type="range" min={1000} max={50000} step={500} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#1D9E75" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#555", fontSize: 11 }}>₹1K</span>
                <span style={{ color: "#555", fontSize: 11 }}>₹50K</span>
              </div>
            </div>
          )}

          {/* Reset */}
          <button onClick={() => { setActivityFilter(""); setDifficultyFilter(""); setStateFilter("All states"); setMaxPrice(50000); setQuery(""); }}
            style={{ width: "100%", padding: "8px", background: "transparent", border: "1px solid #222", borderRadius: 8, color: "#555", fontSize: 12, cursor: "pointer" }}>
            Reset filters
          </button>
        </aside>

        {/* Results */}
        <div style={{ flex: 1 }}>
          {/* Sort row */}
          {view === "treks" && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <p style={{ color: "#555", fontSize: 13 }}>{filteredTreks.length} results</p>
              <div style={{ display: "flex", gap: 8 }}>
                {(["rating", "price_asc", "price_desc"] as const).map((s) => (
                  <button key={s} onClick={() => setSortBy(s)} style={{
                    padding: "6px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer",
                    border: sortBy === s ? "1px solid #1D9E75" : "1px solid #222",
                    background: sortBy === s ? "#0F2A1E" : "transparent",
                    color: sortBy === s ? "#1D9E75" : "#555",
                  }}>
                    {s === "rating" ? "Top rated" : s === "price_asc" ? "Price ↑" : "Price ↓"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {view === "treks" ? (
            filteredTreks.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
                {filteredTreks.map((trek) => <TrekCard key={trek.id} trek={trek} />)}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <p style={{ fontSize: 40, marginBottom: 16 }}>🏔️</p>
                <p style={{ color: "#fff", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No treks found</p>
                <p style={{ color: "#555", fontSize: 14 }}>Try adjusting your filters</p>
              </div>
            )
          ) : (
            filteredAgencies.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                {filteredAgencies.map((agency) => <AgencyCard key={agency.id} agency={agency} />)}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <p style={{ fontSize: 40, marginBottom: 16 }}>🏕️</p>
                <p style={{ color: "#fff", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No agencies found</p>
                <p style={{ color: "#555", fontSize: 14 }}>Try adjusting your filters</p>
              </div>
            )
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div style={{ background: "#0a0a0a", minHeight: "100vh" }} />}>
      <ExploreContent />
    </Suspense>
  );
}
