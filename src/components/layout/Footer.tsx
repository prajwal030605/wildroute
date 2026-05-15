"use client";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer style={{
      background: "var(--wr-bg-alt)",
      borderTop: "1px solid var(--wr-border)",
      padding: "48px 24px 24px",
      transition: "background 0.2s, border-color 0.2s",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 14 }}>
              <Image src="/WildRoute_PFP_Tilted.png" alt="WildRoute" width={32} height={32} style={{ borderRadius: "50%" }} />
              <span style={{ color: "var(--wr-text)", fontWeight: 700, fontSize: 16 }}>
                Wild<span style={{ color: "var(--wr-green)" }}>Route</span>
              </span>
            </Link>
            <p style={{ color: "var(--wr-text-faint)", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
              India&apos;s first platform to compare &amp; book adventure agencies.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {["Instagram", "YouTube", "X"].map((s) => (
                <div key={s} style={{
                  width: 32, height: 32, borderRadius: "50%",
                  border: "1px solid var(--wr-border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ color: "var(--wr-text-faint)", fontSize: 10 }}>{s[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <p style={{ color: "var(--wr-text)", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Explore</p>
            {[
              ["Trekking", "/explore?type=trekking"],
              ["Rafting", "/explore?type=rafting"],
              ["Paragliding", "/explore?type=paragliding"],
              ["Bungee Jumping", "/explore?type=bungee"],
              ["All Activities", "/explore"],
            ].map(([label, href]) => (
              <Link key={label} href={href}
                style={{ display: "block", color: "var(--wr-text-faint)", fontSize: 13, textDecoration: "none", marginBottom: 10 }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--wr-green)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--wr-text-faint)")}>
                {label}
              </Link>
            ))}
          </div>

          {/* Destinations */}
          <div>
            <p style={{ color: "var(--wr-text)", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Destinations</p>
            {["Uttarakhand", "Himachal Pradesh", "Ladakh", "Meghalaya", "Sikkim", "Goa"].map((d) => (
              <Link key={d} href={`/explore?state=${d}`}
                style={{ display: "block", color: "var(--wr-text-faint)", fontSize: 13, textDecoration: "none", marginBottom: 10 }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--wr-green)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--wr-text-faint)")}>
                {d}
              </Link>
            ))}
          </div>

          {/* Blog */}
          <div>
            <p style={{ color: "var(--wr-text)", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Blog</p>
            {[
              ["Spiti Valley Trek Cost", "/blog/spiti-valley-trek-cost"],
              ["How to Pick an Agency", "/blog/how-to-pick-legit-adventure-agency"],
              ["Best Treks for Beginners", "/blog/best-treks-india-beginners"],
              ["Rishikesh Rafting Guide", "/blog/rishikesh-rafting-complete-guide"],
              ["All Articles", "/blog"],
            ].map(([label, href]) => (
              <Link key={label} href={href}
                style={{ display: "block", color: "var(--wr-text-faint)", fontSize: 13, textDecoration: "none", marginBottom: 10 }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--wr-green)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--wr-text-faint)")}>
                {label}
              </Link>
            ))}
          </div>

          {/* For agencies */}
          <div>
            <p style={{ color: "var(--wr-text)", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>For Agencies</p>
            <p style={{ color: "var(--wr-text-faint)", fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
              List your agency for free. No commission for the first 6 months.
            </p>
            <Link href="/#waitlist" style={{
              display: "inline-block", border: "1px solid var(--wr-green)", color: "var(--wr-green)",
              padding: "8px 16px", borderRadius: 8, fontSize: 12, textDecoration: "none",
            }}>
              Join as agency →
            </Link>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid var(--wr-border)", paddingTop: 24,
          display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
        }}>
          <span style={{ color: "var(--wr-text-faint)", fontSize: 12 }}>© 2025 WildRoute · gowildroute.com</span>
          <span style={{ color: "var(--wr-text-faint)", fontSize: 12 }}>Your route to real adventure</span>
        </div>
      </div>
    </footer>
  );
}
