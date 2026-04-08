"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, clearSession, type WildRouteSession } from "@/lib/auth-session";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState<WildRouteSession | null>(null);

  useEffect(() => {
    setSession(getSession());
  }, []);

  function logout() {
    clearSession();
    setSession(null);
    setMenuOpen(false);
    router.push("/");
  }

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(10,10,10,0.92)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid #1a1a1a",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 24px",
        height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <Image src="/WildRoute_PFP_Tilted.png" alt="WildRoute" width={36} height={36} style={{ borderRadius: "50%" }} />
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>Wild<span style={{ color: "#1D9E75" }}>Route</span></span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="desktop-nav">
          <Link href="/explore" style={{ color: "#aaa", fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "#aaa")}>
            Explore
          </Link>
          <Link href="/explore?type=trekking" style={{ color: "#aaa", fontSize: 14, textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "#aaa")}>
            Treks
          </Link>
          <Link href="/explore?type=rafting" style={{ color: "#aaa", fontSize: 14, textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "#aaa")}>
            Rafting
          </Link>
          <Link href="/explore?type=paragliding" style={{ color: "#aaa", fontSize: 14, textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "#aaa")}>
            Paragliding
          </Link>
          <Link href="/blog" style={{ color: "#aaa", fontSize: 14, textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "#aaa")}>
            Blog
          </Link>
          {session ? (
            <>
              {session.role === "admin" && (
                <Link href="/admin" style={{ color: "#1D9E75", fontSize: 14, textDecoration: "none", fontWeight: 500 }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#2ecf9a")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#1D9E75")}>
                  Dashboard
                </Link>
              )}
              <button
                type="button"
                onClick={logout}
                style={{ background: "none", border: "none", color: "#aaa", fontSize: 14, cursor: "pointer", padding: 0 }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "#aaa")}
              >
                Log out
              </button>
            </>
          ) : (
            <Link href="/register" style={{ color: "#aaa", fontSize: 14, textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "#aaa")}>
              Register now
            </Link>
          )}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/#waitlist" style={{
            background: "#1D9E75", color: "#fff", padding: "8px 18px",
            borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: "none",
          }}>
            Join waitlist
          </Link>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "none" }}
            className="hamburger"
            aria-label="Menu"
          >
            <div style={{ width: 22, height: 2, background: "#fff", marginBottom: 5 }} />
            <div style={{ width: 22, height: 2, background: "#fff", marginBottom: 5 }} />
            <div style={{ width: 22, height: 2, background: "#fff" }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: "#0f0f0f", borderTop: "1px solid #1a1a1a",
          padding: "16px 24px", display: "flex", flexDirection: "column", gap: 16,
        }}>
          {["Explore|/explore", "Treks|/explore?type=trekking", "Rafting|/explore?type=rafting", "Paragliding|/explore?type=paragliding", "Blog|/blog"].map((item) => {
            const [label, href] = item.split("|");
            return (
              <Link key={label} href={href} onClick={() => setMenuOpen(false)}
                style={{ color: "#ccc", fontSize: 15, textDecoration: "none" }}>
                {label}
              </Link>
            );
          })}
          {session ? (
            <>
              {session.role === "admin" && (
                <Link href="/admin" onClick={() => setMenuOpen(false)} style={{ color: "#1D9E75", fontSize: 15, textDecoration: "none", fontWeight: 500 }}>
                  Dashboard
                </Link>
              )}
              <button type="button" onClick={logout} style={{ background: "none", border: "none", color: "#ccc", fontSize: 15, textAlign: "left", cursor: "pointer", padding: 0 }}>
                Log out
              </button>
            </>
          ) : (
            <Link href="/register" onClick={() => setMenuOpen(false)} style={{ color: "#ccc", fontSize: 15, textDecoration: "none" }}>
              Register now
            </Link>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
