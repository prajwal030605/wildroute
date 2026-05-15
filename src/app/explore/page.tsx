"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TrekCard from "@/components/ui/TrekCard";
import AgencyCard from "@/components/ui/AgencyCard";
import { supabase } from "@/lib/supabase";
import { mapAgency, mapTrek } from "@/lib/supabase-data";
import type { Agency, Trek, ActivityType } from "@/types";

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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFiltersOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [treks, setTreks] = useState<Trek[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    async function fetchLiveData() {
      const { data: agencyRows } = await supabase
        .from("agencies_directory")
        .select("*")
        .eq("verified", true)
        .eq("onboarding_complete", true)
        .order("created_at", { ascending: false });

      const { data: trekRows } = await supabase
        .from("agency_treks")
        .select("*")
        .order("created_at", { ascending: false });

      const mappedAgencies = (agencyRows || []).map(mapAgency);
      const verifiedEmails = new Set((agencyRows || []).map(a => String(a.email)));
      const mappedTreks = (trekRows || [])
        .filter(row => verifiedEmails.has(String(row.agency_email)) && Number(row.price_per_person) > 0)
        .map(row => {
          const agencyRow = (agencyRows || []).find(a => String(a.email) === String(row.agency_email));
          return mapTrek(row, agencyRow);
        });

      setAgencies(mappedAgencies);
      setTreks(mappedTreks);
      setDataLoading(false);
    }
    fetchLiveData();
  }, []);

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
  }, [treks, query, activityFilter, difficultyFilter, stateFilter, maxPrice, sortBy]);

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
  }, [agencies, query, activityFilter, stateFilter]);

  const activeFilterCount = [
    activityFilter !== "",
    difficultyFilter !== "",
    stateFilter !== "All states",
    maxPrice < 50000,
  ].filter(Boolean).length;

  function resetAll() {
    setActivityFilter(""); setDifficultyFilter("");
    setStateFilter("All states"); setMaxPrice(50000); setQuery("");
  }

  const filterActive = filtersOpen || activeFilterCount > 0;

  return (
    <main style={{ background: "var(--wr-bg)", minHeight: "100vh", fontFamily: "sans-serif", transition: "background 0.2s" }}>
      <Navbar />

      {/* ── Top bar ── */}
      <section style={{ paddingTop: 88, background: "var(--wr-bg)", borderBottom: "1px solid var(--wr-border)", transition: "background 0.2s, border-color 0.2s" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px 0" }}>
          <h1 style={{ color: "var(--wr-text)", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Explore adventures</h1>
          <p style={{ color: "var(--wr-text-faint)", fontSize: 13, marginBottom: 20 }}>
            {dataLoading ? "Loading..." : `${filteredTreks.length} treks · ${filteredAgencies.length} agencies across India`}
          </p>

          {/* Search + Filters row */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
            {/* Search */}
            <div style={{ display: "flex", background: "var(--wr-card)", border: "1px solid var(--wr-border-strong)", borderRadius: 10, overflow: "hidden", flex: "1 1 280px", maxWidth: 500 }}>
              <input value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search treks, destinations..."
                style={{ flex: 1, background: "transparent", border: "none", padding: "11px 16px", fontSize: 14, color: "var(--wr-text)", outline: "none" }} />
              {query && (
                <button onClick={() => setQuery("")} style={{ background: "none", border: "none", color: "var(--wr-text-faint)", padding: "0 12px", cursor: "pointer" }}>✕</button>
              )}
            </div>

            {/* Single Filters button */}
            <div ref={filterRef} style={{ position: "relative" }}>
              <button onClick={() => setFiltersOpen(o => !o)} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "11px 18px", borderRadius: 10, fontSize: 13, fontWeight: 500,
                cursor: "pointer",
                background: filterActive ? "var(--wr-green-bg)" : "var(--wr-card)",
                border: `1px solid ${filterActive ? "var(--wr-green)" : "var(--wr-border-strong)"}`,
                color: filterActive ? "var(--wr-green)" : "var(--wr-text-muted)",
                transition: "all 0.2s",
              }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M1 3h14v1.5L9 10v5l-2-1V10L1 4.5V3z"/></svg>
                Filters
                {activeFilterCount > 0 && (
                  <span style={{ background: "var(--wr-green)", color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Dropdown panel */}
              {filtersOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 100,
                  background: "var(--wr-card)", border: "1px solid var(--wr-border-strong)", borderRadius: 14,
                  padding: 20, minWidth: 520, boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                  display: "grid", gridTemplateColumns: view === "treks" ? "1fr 1fr 1fr" : "1fr 1fr", gap: 20,
                  transition: "background 0.2s",
                }}>
                  {/* Difficulty — treks only */}
                  {view === "treks" && (
                    <div>
                      <p style={{ color: "var(--wr-text-faint)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>DIFFICULTY</p>
                      {difficultyFilters.map(f => (
                        <button key={f.value} onClick={() => setDifficultyFilter(f.value)} style={{
                          display: "block", width: "100%", textAlign: "left", padding: "7px 10px",
                          borderRadius: 8, fontSize: 13, cursor: "pointer", border: "none", marginBottom: 3,
                          background: difficultyFilter === f.value ? "var(--wr-green-bg)" : "transparent",
                          color: difficultyFilter === f.value ? "var(--wr-green)" : "var(--wr-text-muted)",
                        }}>{f.label}</button>
                      ))}
                    </div>
                  )}

                  {/* Location */}
                  <div>
                    <p style={{ color: "var(--wr-text-faint)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>LOCATION</p>
                    {stateFilters.map(s => (
                      <button key={s} onClick={() => setStateFilter(s)} style={{
                        display: "block", width: "100%", textAlign: "left", padding: "7px 10px",
                        borderRadius: 8, fontSize: 13, cursor: "pointer", border: "none", marginBottom: 3,
                        background: stateFilter === s ? "var(--wr-green-bg)" : "transparent",
                        color: stateFilter === s ? "var(--wr-green)" : "var(--wr-text-muted)",
                      }}>{s}</button>
                    ))}
                  </div>

                  {/* Budget — treks only */}
                  {view === "treks" && (
                    <div>
                      <p style={{ color: "var(--wr-text-faint)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>MAX BUDGET</p>
                      <p style={{ color: "var(--wr-green)", fontSize: 20, fontWeight: 700, marginBottom: 12 }}>₹{maxPrice.toLocaleString("en-IN")}</p>
                      <input type="range" min={1000} max={50000} step={500} value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        style={{ width: "100%", accentColor: "var(--wr-green)", marginBottom: 6 }} />
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--wr-text-faint)", fontSize: 11 }}>₹1K</span>
                        <span style={{ color: "var(--wr-text-faint)", fontSize: 11 }}>₹50K</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ gridColumn: "1 / -1", borderTop: "1px solid var(--wr-border)", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button onClick={resetAll} style={{ background: "transparent", border: "none", color: "var(--wr-text-faint)", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>
                      Reset all
                    </button>
                    <button onClick={() => setFiltersOpen(false)} style={{ background: "var(--wr-green)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      Apply filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* View toggle */}
            <div style={{ display: "flex", border: "1px solid var(--wr-border-strong)", borderRadius: 10, overflow: "hidden", marginLeft: "auto" }}>
              <button onClick={() => setView("treks")} style={{
                padding: "11px 18px", fontSize: 13, cursor: "pointer", border: "none",
                background: view === "treks" ? "var(--wr-green)" : "transparent",
                color: view === "treks" ? "#fff" : "var(--wr-text-muted)", fontWeight: 500,
              }}>
                Treks & Activities
              </button>
              <button onClick={() => setView("agencies")} style={{
                padding: "11px 18px", fontSize: 13, cursor: "pointer", border: "none",
                background: view === "agencies" ? "var(--wr-green)" : "transparent",
                color: view === "agencies" ? "#fff" : "var(--wr-text-muted)", fontWeight: 500,
              }}>
                Agencies
              </button>
            </div>
          </div>

          {/* Activity pills */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 16 }}>
            {activityFilters.map((f) => (
              <button key={f.value} onClick={() => setActivityFilter(f.value)} style={{
                padding: "6px 14px", borderRadius: 30, fontSize: 12, cursor: "pointer", fontWeight: 500,
                border: activityFilter === f.value ? "1px solid var(--wr-green)" : "1px solid var(--wr-border-strong)",
                background: activityFilter === f.value ? "var(--wr-green-bg)" : "transparent",
                color: activityFilter === f.value ? "var(--wr-green)" : "var(--wr-text-faint)",
                whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s",
              }}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Active filter tags */}
          {activeFilterCount > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", paddingBottom: 12 }}>
              {difficultyFilter && (
                <span style={{ background: "var(--wr-green-bg)", border: "1px solid var(--wr-green-border)", color: "var(--wr-green)", fontSize: 11, padding: "3px 10px", borderRadius: 20, display: "flex", alignItems: "center", gap: 6 }}>
                  {difficultyFilter} <button onClick={() => setDifficultyFilter("")} style={{ background: "none", border: "none", color: "var(--wr-green)", cursor: "pointer", padding: 0, fontSize: 12 }}>✕</button>
                </span>
              )}
              {stateFilter !== "All states" && (
                <span style={{ background: "var(--wr-green-bg)", border: "1px solid var(--wr-green-border)", color: "var(--wr-green)", fontSize: 11, padding: "3px 10px", borderRadius: 20, display: "flex", alignItems: "center", gap: 6 }}>
                  {stateFilter} <button onClick={() => setStateFilter("All states")} style={{ background: "none", border: "none", color: "var(--wr-green)", cursor: "pointer", padding: 0, fontSize: 12 }}>✕</button>
                </span>
              )}
              {maxPrice < 50000 && (
                <span style={{ background: "var(--wr-green-bg)", border: "1px solid var(--wr-green-border)", color: "var(--wr-green)", fontSize: 11, padding: "3px 10px", borderRadius: 20, display: "flex", alignItems: "center", gap: 6 }}>
                  Max ₹{maxPrice.toLocaleString("en-IN")} <button onClick={() => setMaxPrice(50000)} style={{ background: "none", border: "none", color: "var(--wr-green)", cursor: "pointer", padding: 0, fontSize: 12 }}>✕</button>
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Results ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>
        {/* Sort row */}
        {view === "treks" && !dataLoading && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <p style={{ color: "var(--wr-text-faint)", fontSize: 13 }}>{filteredTreks.length} results</p>
            <div style={{ display: "flex", gap: 6 }}>
              {(["rating", "price_asc", "price_desc"] as const).map((s) => (
                <button key={s} onClick={() => setSortBy(s)} style={{
                  padding: "6px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer",
                  border: sortBy === s ? "1px solid var(--wr-green)" : "1px solid var(--wr-border-strong)",
                  background: sortBy === s ? "var(--wr-green-bg)" : "transparent",
                  color: sortBy === s ? "var(--wr-green)" : "var(--wr-text-faint)",
                }}>
                  {s === "rating" ? "Top rated" : s === "price_asc" ? "Price ↑" : "Price ↓"}
                </button>
              ))}
            </div>
          </div>
        )}

        {dataLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{ background: "var(--wr-card)", borderRadius: 14, height: 280, border: "1px solid var(--wr-border)", animation: "pulse 1.5s ease-in-out infinite" }} />
            ))}
          </div>
        ) : view === "treks" ? (
          filteredTreks.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
              {filteredTreks.map((trek) => <TrekCard key={trek.id} trek={trek} />)}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ fontSize: 40, marginBottom: 16 }}>🏔️</p>
              <p style={{ color: "var(--wr-text)", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No treks found</p>
              <p style={{ color: "var(--wr-text-faint)", fontSize: 14 }}>Try adjusting your filters</p>
              {activeFilterCount > 0 && (
                <button onClick={resetAll} style={{ marginTop: 16, background: "transparent", border: "1px solid var(--wr-border-strong)", color: "var(--wr-text-muted)", padding: "8px 20px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
                  Clear filters
                </button>
              )}
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
              <p style={{ color: "var(--wr-text)", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No agencies found</p>
              <p style={{ color: "var(--wr-text-faint)", fontSize: 14 }}>Try adjusting your filters</p>
            </div>
          )
        )}
      </div>

      <Footer />
    </main>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div style={{ background: "var(--wr-bg)", minHeight: "100vh" }} />}>
      <ExploreContent />
    </Suspense>
  );
}
