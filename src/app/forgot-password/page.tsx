"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setError("Please enter your email."); return; }
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSent(true);
  }

  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <Navbar />
      <section style={{
        paddingTop: 130, paddingBottom: 80,
        display: "flex", flexDirection: "column", alignItems: "center",
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(29,158,117,0.10) 0%, transparent 70%)",
      }}>
        <div style={{
          maxWidth: 420, width: "100%", padding: "0 24px",
        }}>
          <div style={{
            background: "#111", border: "1px solid #1a1a1a", borderRadius: 20,
            padding: "36px 32px",
          }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <Image src="/WildRoute_PFP_Tilted.png" alt="WildRoute" width={48} height={48}
                style={{ borderRadius: "50%", marginBottom: 14 }} />
              <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
                Reset Password
              </h1>
              <p style={{ color: "#666", fontSize: 13 }}>
                Enter your agency email and we&apos;ll send a reset link.
              </p>
            </div>

            {sent ? (
              <div style={{
                background: "rgba(29,158,117,0.1)", border: "1px solid rgba(29,158,117,0.3)",
                borderRadius: 12, padding: "20px 24px", textAlign: "center",
              }}>
                <p style={{ fontSize: 28, margin: "0 0 12px" }}>📬</p>
                <p style={{ color: "#1D9E75", fontWeight: 600, fontSize: 15, margin: "0 0 8px" }}>
                  Reset link sent!
                </p>
                <p style={{ color: "#666", fontSize: 13, margin: 0 }}>
                  Check your email at <strong style={{ color: "#fff" }}>{email}</strong> and click the link to set a new password.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {error && (
                  <div style={{
                    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: 8, padding: "10px 14px",
                  }}>
                    <p style={{ color: "#EF4444", fontSize: 13, margin: 0 }}>{error}</p>
                  </div>
                )}
                <input
                  type="email"
                  placeholder="Agency email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    width: "100%", background: "#111", border: "1px solid #222",
                    borderRadius: 10, padding: "13px 16px", fontSize: 14, color: "#fff",
                    outline: "none", boxSizing: "border-box",
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%", padding: 14, background: "#1D9E75", color: "#fff",
                    border: "none", borderRadius: 10, fontSize: 14, fontWeight: 500,
                    cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? "Sending..." : "Send reset link"}
                </button>
              </form>
            )}

            <p style={{ color: "#444", fontSize: 13, textAlign: "center", marginTop: 20 }}>
              Remember your password?{" "}
              <Link href="/register/agency" style={{ color: "#1D9E75", textDecoration: "none" }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
