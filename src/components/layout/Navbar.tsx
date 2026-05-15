"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, clearSession, type WildRouteSession } from "@/lib/auth-session";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState<WildRouteSession | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setSession(getSession());
  }, []);

  function logout() {
    clearSession();
    setSession(null);
    setMenuOpen(false);
    router.push("/");
  }

  const isDark = theme === "dark";

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "var(--wr-nav-bg)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--wr-nav-border)",
      transition: "background 0.2s, border-color 0.2s",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 24px",
        height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <Image src="/WildRoute_PFP_Tilted.png" alt="WildRoute" width={36} height={36} style={{ borderRadius: "50%" }} />
          <span style={{ color: "var(--wr-text)", fontWeight: 700, fontSize: 18 }}>
            Wild<span style={{ color: "var(--wr-green)" }}>Route</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="desktop-nav">
          {[
            { label: "Explore", href: "/explore" },
            { label: "Treks", href: "/explore?type=trekking" },
            { label: "Rafting", href: "/explore?type=rafting" },
            { label: "Paragliding", href: "/explore?type=paragliding" },
            { label: "Blog", href: "/blog" },
          ].map((item) => (
            <Link key={item.label} href={item.href}
              style={{ color: "var(--wr-text-muted)", fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--wr-text)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--wr-text-muted)")}>
              {item.label}
            </Link>
          ))}
          {session ? (
            <>
              {session.role === "admin" && (
                <Link href="/admin" style={{ color: "var(--wr-green)", fontSize: 14, textDecoration: "none", fontWeight: 500 }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                  Dashboard
                </Link>
              )}
              <button
                type="button"
                onClick={logout}
                style={{ background: "none", border: "none", color: "var(--wr-text-muted)", fontSize: 14, cursor: "pointer", padding: 0 }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--wr-text)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--wr-text-muted)")}
              >
                Log out
              </button>
            </>
          ) : (
            <Link href="/register" style={{ color: "var(--wr-text-muted)", fontSize: 14, textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--wr-text)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--wr-text-muted)")}>
              Register now
            </Link>
          )}
        </div>

        {/* Right side: theme toggle + CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            style={{
              background: "var(--wr-card)", border: "1px solid var(--wr-border)",
              borderRadius: 8, width: 36, height: 36,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 16, transition: "background 0.2s, border-color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--wr-green)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--wr-border)")}
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          <Link href="/register" style={{
            background: "var(--wr-green)", color: "#fff", padding: "8px 18px",
            borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: "none",
          }}>
            Register Now
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "none" }}
            className="hamburger"
            aria-label="Menu"
          >
            <div style={{ width: 22, height: 2, background: "var(--wr-text)", marginBottom: 5 }} />
            <div style={{ width: 22, height: 2, background: "var(--wr-text)", marginBottom: 5 }} />
            <div style={{ width: 22, height: 2, background: "var(--wr-text)" }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: "var(--wr-card)", borderTop: "1px solid var(--wr-border)",
          padding: "16px 24px", display: "flex", flexDirection: "column", gap: 16,
        }}>
          {["Explore|/explore", "Treks|/explore?type=trekking", "Rafting|/explore?type=rafting", "Paragliding|/explore?type=paragliding", "Blog|/blog"].map((item) => {
            const [label, href] = item.split("|");
            return (
              <Link key={label} href={href} onClick={() => setMenuOpen(false)}
                style={{ color: "var(--wr-text-2)", fontSize: 15, textDecoration: "none" }}>
                {label}
              </Link>
            );
          })}
          {session ? (
            <>
              {session.role === "admin" && (
                <Link href="/admin" onClick={() => setMenuOpen(false)} style={{ color: "var(--wr-green)", fontSize: 15, textDecoration: "none", fontWeight: 500 }}>
                  Dashboard
                </Link>
              )}
              <button type="button" onClick={logout} style={{ background: "none", border: "none", color: "var(--wr-text-2)", fontSize: 15, textAlign: "left", cursor: "pointer", padding: 0 }}>
                Log out
              </button>
            </>
          ) : (
            <Link href="/register" onClick={() => setMenuOpen(false)} style={{ color: "var(--wr-text-2)", fontSize: 15, textDecoration: "none" }}>
              Register now
            </Link>
          )}

          {/* Theme toggle in mobile menu */}
          <button
            onClick={() => { toggleTheme(); setMenuOpen(false); }}
            style={{ background: "none", border: "none", color: "var(--wr-text-muted)", fontSize: 14, textAlign: "left", cursor: "pointer", padding: 0 }}
          >
            {isDark ? "☀️ Switch to light mode" : "🌙 Switch to dark mode"}
          </button>
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
