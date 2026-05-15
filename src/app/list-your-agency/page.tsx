import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "List Your Agency on WildRoute",
  description: "Get your adventure agency listed on WildRoute. Reach thousands of trekkers across India. Free for 6 months, no commission.",
};

const steps = [
  {
    num: "01",
    icon: "📋",
    title: "Create your account",
    time: "2 minutes",
    desc: "Sign up with your agency email. We use Supabase-powered authentication — secure and instant.",
    details: ["Email or Google login", "No credit card needed", "Instant account creation"],
  },
  {
    num: "02",
    icon: "🏢",
    title: "Fill agency details",
    time: "5–10 minutes",
    desc: "Tell us about your agency — location, activities offered, PAN number, and a brief description. This is your public profile.",
    details: ["Agency name, location & state", "Activities you offer", "PAN number for verification", "Contact details"],
  },
  {
    num: "03",
    icon: "🥾",
    title: "Add your first activity",
    time: "5–10 minutes",
    desc: "Add your first trek or adventure listing — itinerary, photos, inclusions, pricing and batch dates.",
    details: ["Trek name, area & altitude", "Day-wise itinerary", "Photos & pricing", "Season & difficulty"],
  },
  {
    num: "04",
    icon: "🔍",
    title: "We review your listing",
    time: "24–48 hours",
    desc: "Our team verifies your details — GST, permits, and agency authenticity. We check every listing before it goes live.",
    details: ["Manual review by WildRoute team", "Document verification", "Quality check on content", "Email on approval"],
  },
  {
    num: "05",
    icon: "🚀",
    title: "Go live & get discovered",
    time: "Instantly after approval",
    desc: "Once approved, your agency and all your listings are live on gowildroute.com. Trekkers can discover you and send enquiries.",
    details: ["Appear on /explore page", "Dedicated agency profile page", "Each trek gets its own page", "Enquiries to your email"],
  },
];

const requirements = [
  { icon: "🪪", title: "PAN Number", desc: "Valid PAN card of the agency or proprietor. Required for all listings." },
  { icon: "🧾", title: "GST Number", desc: "GST registration if applicable. Not mandatory but boosts trust." },
  { icon: "📸", title: "Activity photos", desc: "At least 3–5 high-quality photos of your trek or activity." },
  { icon: "📍", title: "Registered address", desc: "Your agency's operating address with PIN code." },
  { icon: "📞", title: "Contact details", desc: "Phone number and email that trekkers can reach you on." },
  { icon: "📝", title: "Trek itinerary", desc: "A day-by-day itinerary for each activity you want to list." },
];

const benefits = [
  { icon: "🆓", title: "Free for 6 months", desc: "No listing fee, no commission for the first 6 months. We grow together." },
  { icon: "🎯", title: "Targeted reach", desc: "Reach trekkers actively searching for your exact activity and region." },
  { icon: "🛡️", title: "Verified badge", desc: "WildRoute-verified agencies get a badge that builds instant trust." },
  { icon: "💬", title: "Direct enquiries", desc: "Enquiries go straight to your email. No middleman, no delay." },
  { icon: "📊", title: "Agency dashboard", desc: "Manage all your listings, add treks, and track enquiries in one place." },
  { icon: "📈", title: "SEO listing page", desc: "Each agency and trek gets a search-engine-optimised page on gowildroute.com." },
];

const faqs = [
  { q: "Is it really free?", a: "Yes. Listing is completely free for the first 6 months after your agency goes live. After that, we move to a small commission model — we only earn when you earn." },
  { q: "How long does verification take?", a: "Usually 24–48 hours on working days. Our team manually reviews every agency before approving." },
  { q: "Can I list multiple treks?", a: "Absolutely. After your first listing is approved, you can add more activities any time by clicking 'Add Another Activity' — no need to re-fill your agency details." },
  { q: "What if my listing is rejected?", a: "We'll email you with the specific reason and what needs to be fixed. You can resubmit after making corrections." },
  { q: "Do trekkers pay through WildRoute?", a: "Currently, enquiries go directly to your email and you handle the booking. Payment gateway integration is on our roadmap." },
  { q: "Can I edit my listing after it goes live?", a: "Edits through the dashboard are coming soon. For urgent changes right now, email us at support@gowildroute.com." },
];

export default function ListYourAgencyPage() {
  return (
    <main style={{ background: "var(--wr-bg)", minHeight: "100vh", fontFamily: "sans-serif", transition: "background 0.2s" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{
        position: "relative", minHeight: "60vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        textAlign: "center", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&auto=format&fit=crop&q=80)",
          backgroundSize: "cover", backgroundPosition: "center",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.5) 50%, rgba(10,10,10,0.95) 100%)" }} />

        <div style={{ position: "relative", zIndex: 2, padding: "120px 24px 80px", maxWidth: 700 }}>
          <span style={{
            border: "1px solid rgba(29,158,117,0.6)", color: "#1D9E75", fontSize: 11,
            padding: "5px 16px", borderRadius: 20, display: "inline-block", marginBottom: 24,
            background: "rgba(29,158,117,0.12)", backdropFilter: "blur(8px)",
          }}>
            FOR AGENCIES · COMPLETELY FREE TO START
          </span>
          <h1 style={{ color: "#fff", fontSize: "clamp(30px, 5vw, 52px)", fontWeight: 900, marginBottom: 20, lineHeight: 1.15, textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
            Get your agency listed on<br /><span style={{ color: "#1D9E75" }}>WildRoute</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 17, maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Reach thousands of trekkers searching for verified adventures across India. Free for 6 months. No commission to start.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register/agency" style={{
              background: "#1D9E75", color: "#fff", padding: "15px 36px",
              borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: "none",
              boxShadow: "0 4px 24px rgba(29,158,117,0.4)",
            }}>
              Start listing for free →
            </Link>
            <a href="#process" style={{
              background: "rgba(255,255,255,0.08)", color: "#fff", padding: "15px 28px",
              borderRadius: 10, fontSize: 15, fontWeight: 500, textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
            }}>
              See the process ↓
            </a>
          </div>
        </div>
      </section>

      {/* ── QUICK STATS ── */}
      <div style={{ background: "var(--wr-bg-alt)", borderTop: "1px solid var(--wr-border)", borderBottom: "1px solid var(--wr-border)", transition: "background 0.2s" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px", display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
          {[
            { num: "Free", label: "First 6 months" },
            { num: "0%", label: "Commission to start" },
            { num: "24–48h", label: "Review turnaround" },
            { num: "247+", label: "Trekkers waiting" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ color: "var(--wr-green)", fontSize: 28, fontWeight: 800 }}>{s.num}</div>
              <div style={{ color: "var(--wr-text-faint)", fontSize: 12, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PROCESS STEPS ── */}
      <section id="process" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ color: "var(--wr-green)", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 12 }}>THE LISTING PROCESS</p>
            <h2 style={{ color: "var(--wr-text)", fontSize: 32, fontWeight: 800, marginBottom: 12 }}>From sign-up to live listing</h2>
            <p style={{ color: "var(--wr-text-faint)", fontSize: 15 }}>Simple, transparent, and fully guided.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {steps.map((step, i) => (
              <div key={step.num} style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
                {/* Timeline */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 60, flexShrink: 0 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                    background: "var(--wr-green-bg)", border: "2px solid var(--wr-green)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18,
                  }}>
                    {step.icon}
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{ width: 2, flex: 1, background: "linear-gradient(to bottom, var(--wr-green), var(--wr-border))", margin: "4px 0", minHeight: 40 }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ paddingLeft: 24, paddingBottom: i < steps.length - 1 ? 48 : 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
                    <span style={{ color: "var(--wr-green)", fontSize: 11, fontWeight: 700 }}>{step.num}</span>
                    <h3 style={{ color: "var(--wr-text)", fontSize: 18, fontWeight: 700, margin: 0 }}>{step.title}</h3>
                    <span style={{ background: "var(--wr-card)", border: "1px solid var(--wr-border)", color: "var(--wr-text-faint)", fontSize: 11, padding: "3px 10px", borderRadius: 20 }}>
                      ⏱ {step.time}
                    </span>
                  </div>
                  <p style={{ color: "var(--wr-text-muted)", fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>{step.desc}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {step.details.map(d => (
                      <span key={d} style={{ background: "var(--wr-card)", border: "1px solid var(--wr-border)", color: "var(--wr-text-muted)", fontSize: 12, padding: "4px 12px", borderRadius: 20, display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ color: "var(--wr-green)", fontSize: 10 }}>✓</span> {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 56 }}>
            <Link href="/register/agency" style={{
              background: "var(--wr-green)", color: "#fff", padding: "16px 40px",
              borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: "none",
              display: "inline-block", boxShadow: "0 4px 24px rgba(29,158,117,0.35)",
            }}>
              Start the process — it&apos;s free →
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHAT YOU NEED ── */}
      <section style={{ padding: "72px 24px", background: "var(--wr-bg-alt)", borderTop: "1px solid var(--wr-border)", borderBottom: "1px solid var(--wr-border)", transition: "background 0.2s" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ color: "var(--wr-green)", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 12 }}>REQUIREMENTS</p>
            <h2 style={{ color: "var(--wr-text)", fontSize: 28, fontWeight: 800 }}>What you&apos;ll need to list</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {requirements.map(r => (
              <div key={r.title} style={{ background: "var(--wr-card)", border: "1px solid var(--wr-border)", borderRadius: 14, padding: 20, display: "flex", gap: 14, transition: "background 0.2s" }}>
                <div style={{ fontSize: 24, flexShrink: 0 }}>{r.icon}</div>
                <div>
                  <p style={{ color: "var(--wr-text)", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{r.title}</p>
                  <p style={{ color: "var(--wr-text-faint)", fontSize: 13, lineHeight: 1.6 }}>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ color: "var(--wr-green)", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 12 }}>WHY WILDROUTE</p>
            <h2 style={{ color: "var(--wr-text)", fontSize: 28, fontWeight: 800 }}>What you get when you list</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {benefits.map(b => (
              <div key={b.title} style={{ background: "var(--wr-green-bg)", border: "1px solid var(--wr-green-border)", borderRadius: 14, padding: 22 }}>
                <div style={{ fontSize: 26, marginBottom: 12 }}>{b.icon}</div>
                <p style={{ color: "var(--wr-text)", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{b.title}</p>
                <p style={{ color: "var(--wr-green)", fontSize: 13, lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "72px 24px", background: "var(--wr-bg-alt)", borderTop: "1px solid var(--wr-border)", borderBottom: "1px solid var(--wr-border)", transition: "background 0.2s" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ color: "var(--wr-green)", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 12 }}>FAQ</p>
            <h2 style={{ color: "var(--wr-text)", fontSize: 28, fontWeight: 800 }}>Common questions</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {faqs.map(f => (
              <div key={f.q} style={{ background: "var(--wr-card)", border: "1px solid var(--wr-border)", borderRadius: 12, padding: "20px 24px", transition: "background 0.2s" }}>
                <p style={{ color: "var(--wr-text)", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{f.q}</p>
                <p style={{ color: "var(--wr-text-muted)", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--wr-green-bg)", border: "2px solid var(--wr-green)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 24 }}>
            🏔️
          </div>
          <h2 style={{ color: "var(--wr-text)", fontSize: 30, fontWeight: 800, marginBottom: 12 }}>Ready to grow your bookings?</h2>
          <p style={{ color: "var(--wr-text-muted)", fontSize: 15, marginBottom: 36, lineHeight: 1.7 }}>
            Join WildRoute and get discovered by thousands of trekkers actively searching for your experiences. Free to start, no risk.
          </p>
          <Link href="/register/agency" style={{
            background: "var(--wr-green)", color: "#fff", padding: "16px 44px",
            borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: "none",
            display: "inline-block", boxShadow: "0 4px 32px rgba(29,158,117,0.4)",
          }}>
            List my agency for free →
          </Link>
          <p style={{ color: "var(--wr-text-faint)", fontSize: 12, marginTop: 14 }}>
            No credit card · No commission for 6 months · Cancel anytime
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
