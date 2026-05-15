"use client";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { getSession, type WildRouteSession } from "@/lib/auth-session";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TrekCard from "@/components/ui/TrekCard";
import AgencyCard from "@/components/ui/AgencyCard";
import { treks } from "@/data/treks";
import { agencies } from "@/data/agencies";

const activities = [
  { label: "Trekking", emoji: "🥾", type: "trekking" },
  { label: "Rafting", emoji: "🚣", type: "rafting" },
  { label: "Paragliding", emoji: "🪂", type: "paragliding" },
  { label: "Bungee", emoji: "🪢", type: "bungee" },
  { label: "Camping", emoji: "⛺", type: "camping" },
  { label: "Cycling", emoji: "🚵", type: "cycling" },
];

const howItWorks = [
  { step: "01", title: "Search your adventure", body: "Filter by activity, destination, budget, difficulty, and duration. Find exactly what you're looking for." },
  { step: "02", title: "Compare agencies", body: "See side-by-side pricing, inclusions, reviews, and safety ratings. No surprises, no hidden costs." },
  { step: "03", title: "Book safely", body: "Pay via UPI or card with full refund protection. Every agency is GST & permit verified before listing." },
];

const stats = [
  { num: "12+", label: "Destinations" },
  { num: "50+", label: "Verified agencies" },
  { num: "200+", label: "Treks & activities" },
  { num: "4.8★", label: "Avg. agency rating" },
];

export default function Home() {
  const [trekkerCount, setTrekkerCount] = useState(247);
  const [agencyCount, setAgencyCount] = useState(38);
  const [tab, setTab] = useState<"trekker" | "agency">("trekker");
  const [submitted, setSubmitted] = useState(false);
  const [submittedType, setSubmittedType] = useState("");
  const [trekkerEmail, setTrekkerEmail] = useState("");
  const [agencyEmail, setAgencyEmail] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewer, setViewer] = useState<WildRouteSession | null>(null);

  useEffect(() => {
    setViewer(getSession());
  }, []);

  useEffect(() => {
    async function fetchCounts() {
      const { count: tCount } = await supabase.from("trekkers").select("*", { count: "exact", head: true });
      const { count: aCount } = await supabase.from("agencies").select("*", { count: "exact", head: true });
      if (tCount !== null) setTrekkerCount(tCount);
      if (aCount !== null) setAgencyCount(aCount);
    }
    fetchCounts();
  }, []);

  function validateEmail(email: string) {
    return email.includes("@") && email.length > 3;
  }

  async function submitTrekker() {
    if (!validateEmail(trekkerEmail)) { setEmailError(true); setTimeout(() => setEmailError(false), 2000); return; }
    const { error } = await supabase.from("trekkers").insert([{ email: trekkerEmail, name: "Trekker" }]);
    if (!error) { setTrekkerCount((c) => c + 1); setSubmittedType("trekker"); setSubmitted(true); }
  }

  async function submitAgency() {
    if (!validateEmail(agencyEmail)) { setEmailError(true); setTimeout(() => setEmailError(false), 2000); return; }
    if (!agencyName.trim()) { alert("Please enter agency name"); return; }
    const { error } = await supabase.from("agencies_waitlist").insert([{ email: agencyEmail, name: agencyName }]);
    if (!error) { setAgencyCount((c) => c + 1); setSubmittedType("agency"); setSubmitted(true); }
  }

  const featuredTreks = treks.slice(0, 4);
  const featuredAgencies = agencies.slice(0, 3);

  return (
    <main style={{ background: "var(--wr-bg)", minHeight: "100vh", fontFamily: "sans-serif", transition: "background 0.2s" }}>
      <Navbar />

      {viewer?.role === "user" && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0, zIndex: 90,
          background: "linear-gradient(90deg, var(--wr-green-bg), #0a1f18)",
          borderBottom: "1px solid var(--wr-green)",
          padding: "10px 24px", textAlign: "center",
        }}>
          <p style={{ color: "#5DCAA5", fontSize: 13, margin: 0 }}>
            You&apos;re signed in as a <strong style={{ color: "var(--wr-text)" }}>traveller</strong> — browse adventures, compare agencies, and join the waitlist below.
          </p>
        </div>
      )}

      {/* ── HERO ── */}
      <section style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        overflow: "hidden",
        paddingTop: viewer?.role === "user" ? 104 : 64,
      }}>
        {/* Mountain background — always dark since photo underneath */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&auto=format&fit=crop&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.35) 40%, rgba(10,10,10,0.85) 80%, var(--wr-bg) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(29,158,117,0.15) 0%, transparent 60%)" }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2, padding: "0 24px", maxWidth: 800, width: "100%" }}>
          <span style={{
            border: "1px solid rgba(29,158,117,0.6)", color: "#1D9E75", fontSize: 11,
            padding: "5px 16px", borderRadius: 20, display: "inline-block", marginBottom: 28,
            background: "rgba(29,158,117,0.12)", backdropFilter: "blur(8px)",
          }}>
            LAUNCHING SOON · INDIA&apos;S ADVENTURE PLATFORM
          </span>

          <h1 style={{ color: "#fff", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, maxWidth: 720, margin: "0 auto 20px", lineHeight: 1.1, textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
            Find &amp; book your next<br />
            <span style={{ color: "#1D9E75" }}>real adventure</span>
          </h1>

          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 17, maxWidth: 500, margin: "0 auto 44px", lineHeight: 1.7, textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}>
            Compare verified trekking, rafting, and paragliding agencies across India. Transparent pricing. Real reviews. Safe booking.
          </p>

          {/* Search bar */}
          <div style={{
            maxWidth: 580, margin: "0 auto 20px",
            display: "flex", background: "rgba(10,10,10,0.85)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 14, overflow: "hidden", backdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (window.location.href = `/explore?q=${searchQuery}`)}
              placeholder="Search treks, destinations, activities..."
              style={{ flex: 1, background: "transparent", border: "none", padding: "18px 20px", fontSize: 15, color: "#fff", outline: "none" }}
            />
            <Link href={`/explore${searchQuery ? `?q=${searchQuery}` : ""}`} style={{
              background: "#1D9E75", color: "#fff", padding: "0 28px",
              display: "flex", alignItems: "center", textDecoration: "none",
              fontSize: 14, fontWeight: 600, whiteSpace: "nowrap",
            }}>
              Search →
            </Link>
          </div>

          {/* Activity pills */}
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {activities.map((a) => (
              <Link key={a.type} href={`/explore?type=${a.type}`} style={{
                background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.75)",
                padding: "8px 16px", borderRadius: 30, fontSize: 13, textDecoration: "none",
                display: "flex", alignItems: "center", gap: 6, backdropFilter: "blur(8px)",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#1D9E75"; (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.15)"; (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.75)"; }}
              >
                {a.emoji} {a.label}
              </Link>
            ))}
          </div>

          {/* Scroll hint */}
          <div style={{ marginTop: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.4 }}>
            <span style={{ color: "#fff", fontSize: 11, letterSpacing: "0.1em" }}>SCROLL TO EXPLORE</span>
            <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, #fff, transparent)" }} />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div style={{ background: "var(--wr-bg-alt)", borderTop: "1px solid var(--wr-border)", borderBottom: "1px solid var(--wr-border)", padding: "32px 24px", transition: "background 0.2s" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 56, flexWrap: "wrap", maxWidth: 800, margin: "0 auto" }}>
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ color: "var(--wr-green)", fontSize: 28, fontWeight: 800 }}>{s.num}</div>
              <div style={{ color: "var(--wr-text-faint)", fontSize: 12, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "var(--wr-green)", fontSize: 28, fontWeight: 800 }}>{trekkerCount}+</div>
            <div style={{ color: "var(--wr-text-faint)", fontSize: 12, marginTop: 4 }}>Trekkers on waitlist</div>
          </div>
        </div>
      </div>

      {/* ── FEATURED TREKS ── */}
      <section style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
            <div>
              <p style={{ color: "var(--wr-green)", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 8 }}>HANDPICKED FOR YOU</p>
              <h2 style={{ color: "var(--wr-text)", fontSize: 28, fontWeight: 700, margin: 0 }}>Featured adventures</h2>
            </div>
            <Link href="/explore" style={{ color: "var(--wr-green)", fontSize: 14, textDecoration: "none" }}>View all →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 20 }}>
            {featuredTreks.map((trek) => <TrekCard key={trek.id} trek={trek} />)}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "72px 24px", background: "var(--wr-bg-alt)", borderTop: "1px solid var(--wr-border)", borderBottom: "1px solid var(--wr-border)", transition: "background 0.2s" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "var(--wr-green)", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 12 }}>SIMPLE PROCESS</p>
          <h2 style={{ color: "var(--wr-text)", fontSize: 28, fontWeight: 700, marginBottom: 48 }}>How WildRoute works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 32 }}>
            {howItWorks.map((step) => (
              <div key={step.step} style={{ textAlign: "left" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: "var(--wr-green-bg)",
                  border: "1px solid var(--wr-green)", display: "flex", alignItems: "center",
                  justifyContent: "center", marginBottom: 16,
                }}>
                  <span style={{ color: "var(--wr-green)", fontSize: 14, fontWeight: 700 }}>{step.step}</span>
                </div>
                <h3 style={{ color: "var(--wr-text)", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{step.title}</h3>
                <p style={{ color: "var(--wr-text-muted)", fontSize: 14, lineHeight: 1.7 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED AGENCIES ── */}
      <section style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
            <div>
              <p style={{ color: "var(--wr-green)", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 8 }}>VERIFIED &amp; TRUSTED</p>
              <h2 style={{ color: "var(--wr-text)", fontSize: 28, fontWeight: 700, margin: 0 }}>Top agencies</h2>
            </div>
            <Link href="/explore?view=agencies" style={{ color: "var(--wr-green)", fontSize: 14, textDecoration: "none" }}>All agencies →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {featuredAgencies.map((agency) => <AgencyCard key={agency.id} agency={agency} />)}
          </div>
        </div>
      </section>

      {/* ── WHY WILDROUTE ── */}
      <section style={{ padding: "72px 24px", background: "var(--wr-bg-alt)", borderTop: "1px solid var(--wr-border)", borderBottom: "1px solid var(--wr-border)", transition: "background 0.2s" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ color: "var(--wr-green)", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 12 }}>WHY US</p>
            <h2 style={{ color: "var(--wr-text)", fontSize: 28, fontWeight: 700 }}>Adventure, done right</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            {[
              { icon: "🛡️", title: "Verified agencies", body: "Every agency checked for GST, permits, and insurance." },
              { icon: "💬", title: "Real reviews", body: "Only from people who actually completed the booking." },
              { icon: "💰", title: "No hidden costs", body: "See exactly what's included before you pay." },
              { icon: "🔒", title: "Safe payments", body: "UPI & card with full refund protection." },
              { icon: "📍", title: "12 destinations", body: "From Ladakh to Meghalaya — we cover India's best." },
              { icon: "⚡", title: "Instant confirm", body: "Most bookings confirmed within 2 hours." },
            ].map((f) => (
              <div key={f.title} style={{ background: "var(--wr-card)", border: "1px solid var(--wr-border)", borderRadius: 14, padding: 20, transition: "background 0.2s, border-color 0.2s" }}>
                <div style={{ fontSize: 24, marginBottom: 12 }}>{f.icon}</div>
                <p style={{ color: "var(--wr-text)", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{f.title}</p>
                <p style={{ color: "var(--wr-text-faint)", fontSize: 12, lineHeight: 1.6 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WAITLIST ── */}
      <section id="waitlist" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <span style={{
            border: "1px solid var(--wr-green)", color: "var(--wr-green)", fontSize: 11,
            padding: "5px 16px", borderRadius: 20, display: "inline-block", marginBottom: 24,
            background: "var(--wr-green-bg)",
          }}>
            LAUNCHING SOON
          </span>
          <h2 style={{ color: "var(--wr-text)", fontSize: 30, fontWeight: 700, marginBottom: 12 }}>Be first to explore</h2>
          <p style={{ color: "var(--wr-text-muted)", fontSize: 15, marginBottom: 36, lineHeight: 1.7 }}>
            Join the waitlist and get early access when we launch — plus exclusive first-mover discounts.
          </p>

          {/* Tab toggle */}
          <div style={{ display: "flex", maxWidth: 280, margin: "0 auto 28px", border: "1px solid var(--wr-border-strong)", borderRadius: 10, overflow: "hidden" }}>
            <button type="button" onClick={() => { setTab("trekker"); setSubmitted(false); }} style={{ flex: 1, padding: "10px 0", fontSize: 13, fontWeight: 500, cursor: "pointer", border: "none", background: tab === "trekker" ? "var(--wr-green)" : "transparent", color: tab === "trekker" ? "#fff" : "var(--wr-text-muted)" }}>I am a trekker</button>
            <button type="button" onClick={() => { setTab("agency"); setSubmitted(false); }} style={{ flex: 1, padding: "10px 0", fontSize: 13, fontWeight: 500, cursor: "pointer", border: "none", background: tab === "agency" ? "var(--wr-green)" : "transparent", color: tab === "agency" ? "#fff" : "var(--wr-text-muted)" }}>I am an agency</button>
          </div>

          {submitted ? (
            <div style={{ background: "var(--wr-green-bg)", border: "1px solid var(--wr-green)", borderRadius: 14, padding: 28 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--wr-green)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10l4.5 4.5 7.5-9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <h3 style={{ color: "var(--wr-text)", fontSize: 17, fontWeight: 600, marginBottom: 8 }}>You&apos;re on the list!</h3>
              <p style={{ color: "var(--wr-green)", fontSize: 14 }}>
                {submittedType === "trekker"
                  ? `You're #${trekkerCount} on the trekker waitlist. We'll email you at launch!`
                  : "Your agency is on the early access list. We'll contact you within 24 hours!"}
              </p>
            </div>
          ) : tab === "trekker" ? (
            <div>
              <input
                value={trekkerEmail} onChange={(e) => setTrekkerEmail(e.target.value)}
                type="email" placeholder="Enter your email address"
                style={{ width: "100%", background: "var(--wr-card)", border: emailError ? "1px solid #EF4444" : "1px solid var(--wr-border-strong)", borderRadius: 10, padding: "14px 16px", fontSize: 14, color: "var(--wr-text)", outline: "none", marginBottom: 12, boxSizing: "border-box" }}
              />
              <button type="button" onClick={submitTrekker} style={{ width: "100%", padding: 14, background: "var(--wr-green)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                Get early access — it&apos;s free
              </button>
              <p style={{ color: "var(--wr-text-faint)", fontSize: 11, marginTop: 10 }}>No spam. Only an email when we launch.</p>
            </div>
          ) : (
            <div>
              <input value={agencyName} onChange={(e) => setAgencyName(e.target.value)} type="text" placeholder="Agency name" style={{ width: "100%", background: "var(--wr-card)", border: "1px solid var(--wr-border-strong)", borderRadius: 10, padding: "14px 16px", fontSize: 14, color: "var(--wr-text)", outline: "none", marginBottom: 12, boxSizing: "border-box" }} />
              <input value={agencyEmail} onChange={(e) => setAgencyEmail(e.target.value)} type="email" placeholder="Your email address" style={{ width: "100%", background: "var(--wr-card)", border: emailError ? "1px solid #EF4444" : "1px solid var(--wr-border-strong)", borderRadius: 10, padding: "14px 16px", fontSize: 14, color: "var(--wr-text)", outline: "none", marginBottom: 12, boxSizing: "border-box" }} />
              <button type="button" onClick={submitAgency} style={{ width: "100%", padding: 14, background: "var(--wr-green)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                List my agency for free
              </button>
              <p style={{ color: "var(--wr-text-faint)", fontSize: 11, marginTop: 10 }}>Free forever for early agencies. No commission for first 6 months.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
