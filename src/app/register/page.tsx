"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export default function RegisterPage() {
  const [showLaunchingSoon, setShowLaunchingSoon] = useState(false);

  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <Navbar />

      <section style={{
        paddingTop: 140, paddingBottom: 80,
        display: "flex", flexDirection: "column", alignItems: "center",
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(29,158,117,0.10) 0%, transparent 70%)",
      }}>
        <span style={{
          border: "1px solid #1D9E75", color: "#1D9E75", fontSize: 11,
          padding: "5px 16px", borderRadius: 20, display: "inline-block", marginBottom: 28,
          background: "rgba(29,158,117,0.08)",
        }}>
          JOIN WILDROUTE
        </span>

        <h1 style={{ color: "#fff", fontSize: 36, fontWeight: 800, marginBottom: 12, textAlign: "center" }}>
          How would you like to <span style={{ color: "#1D9E75" }}>register</span>?
        </h1>
        <p style={{ color: "#666", fontSize: 15, marginBottom: 48, textAlign: "center", maxWidth: 460, lineHeight: 1.7 }}>
          Choose how you want to use WildRoute. Agencies can list and manage their adventures. Travellers get early access when we launch.
        </p>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", maxWidth: 700, width: "100%", padding: "0 24px" }}>
          {/* Agency Card */}
          <Link href="/register/agency" style={{
            flex: "1 1 280px", maxWidth: 320,
            background: "#111", border: "1px solid #1a1a1a", borderRadius: 16,
            padding: 32, textDecoration: "none", textAlign: "center",
            transition: "all 0.25s",
            cursor: "pointer",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#1D9E75"; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a1a1a"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: 16, background: "#0F2A1E",
              border: "1px solid #1D9E75", display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 20px", fontSize: 28,
            }}>
              🏢
            </div>
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Register as Agency</h2>
            <p style={{ color: "#666", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
              List your treks, rafting, paragliding &amp; more. Reach thousands of verified adventure seekers across India.
            </p>
            <span style={{
              display: "inline-block", background: "#1D9E75", color: "#fff",
              padding: "10px 24px", borderRadius: 8, fontSize: 13, fontWeight: 500,
            }}>
              Get started →
            </span>
          </Link>

          {/* Tourist Card */}
          <div
            onClick={() => setShowLaunchingSoon(true)}
            style={{
              flex: "1 1 280px", maxWidth: 320,
              background: "#111", border: "1px solid #1a1a1a", borderRadius: 16,
              padding: 32, textAlign: "center",
              transition: "all 0.25s",
              cursor: "pointer",
              position: "relative",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a1a1a"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: 16, background: "#1a1a1a",
              border: "1px solid #333", display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 20px", fontSize: 28,
            }}>
              🎒
            </div>
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Register as Traveller</h2>
            <p style={{ color: "#666", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
              Browse verified agencies, compare prices, read real reviews, and book your next adventure safely.
            </p>
            <span style={{
              display: "inline-block", background: "#222", color: "#888",
              padding: "10px 24px", borderRadius: 8, fontSize: 13, fontWeight: 500,
            }}>
              Coming soon
            </span>
          </div>
        </div>

        {/* Launching Soon Modal */}
        {showLaunchingSoon && (
          <div
            onClick={() => setShowLaunchingSoon(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 200,
              background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 24,
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: "#111", border: "1px solid #1a1a1a", borderRadius: 20,
                padding: "40px 36px", maxWidth: 420, width: "100%", textAlign: "center",
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: "50%", background: "#0F2A1E",
                border: "1px solid #1D9E75", display: "flex", alignItems: "center",
                justifyContent: "center", margin: "0 auto 20px", fontSize: 24,
              }}>
                🚀
              </div>
              <h3 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Launching Soon!</h3>
              <p style={{ color: "#888", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                Traveller registration is not available yet. We&apos;re building something amazing for you! Join our waitlist to be the first to know when we launch.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/#waitlist" style={{
                  background: "#1D9E75", color: "#fff", padding: "10px 24px",
                  borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: "none",
                }}>
                  Join waitlist
                </Link>
                <button
                  type="button"
                  onClick={() => setShowLaunchingSoon(false)}
                  style={{
                    background: "transparent", color: "#666", padding: "10px 24px",
                    borderRadius: 8, fontSize: 13, fontWeight: 500, border: "1px solid #333",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <p style={{ color: "#333", fontSize: 12, marginTop: 40 }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#1D9E75", textDecoration: "none" }}>Log in here</Link>
        </p>
      </section>
    </main>
  );
}
