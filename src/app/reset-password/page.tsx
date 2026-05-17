"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase puts access_token in the URL hash after redirect
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      setReady(true);
    } else {
      // Also check if there's an active session (Supabase may have set it)
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) setReady(true);
        else setError("Invalid or expired reset link. Please request a new one.");
      });
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setDone(true);
    setTimeout(() => router.push("/register/agency"), 2500);
  }

  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <Navbar />
      <section style={{
        paddingTop: 130, paddingBottom: 80,
        display: "flex", flexDirection: "column", alignItems: "center",
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(29,158,117,0.10) 0%, transparent 70%)",
      }}>
        <div style={{ maxWidth: 420, width: "100%", padding: "0 24px" }}>
          <div style={{
            background: "#111", border: "1px solid #1a1a1a", borderRadius: 20,
            padding: "36px 32px",
          }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <Image src="/WildRoute_PFP_Tilted.png" alt="WildRoute" width={48} height={48}
                style={{ borderRadius: "50%", marginBottom: 14 }} />
              <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
                Set New Password
              </h1>
              <p style={{ color: "#666", fontSize: 13 }}>Choose a strong password for your agency account.</p>
            </div>

            {done ? (
              <div style={{
                background: "rgba(29,158,117,0.1)", border: "1px solid rgba(29,158,117,0.3)",
                borderRadius: 12, padding: "20px 24px", textAlign: "center",
              }}>
                <p style={{ fontSize: 28, margin: "0 0 12px" }}>✅</p>
                <p style={{ color: "#1D9E75", fontWeight: 600, fontSize: 15, margin: "0 0 8px" }}>
                  Password updated!
                </p>
                <p style={{ color: "#666", fontSize: 13, margin: 0 }}>
                  Redirecting you to sign in...
                </p>
              </div>
            ) : !ready && error ? (
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#EF4444", fontSize: 14, marginBottom: 20 }}>{error}</p>
                <Link href="/forgot-password" style={{
                  display: "inline-block", background: "#1D9E75", color: "#fff",
                  padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 500, textDecoration: "none",
                }}>
                  Request new link
                </Link>
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
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    width: "100%", background: "#111", border: "1px solid #222",
                    borderRadius: 10, padding: "13px 16px", fontSize: 14, color: "#fff",
                    outline: "none", boxSizing: "border-box",
                  }}
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  style={{
                    width: "100%", background: "#111", border: "1px solid #222",
                    borderRadius: 10, padding: "13px 16px", fontSize: 14, color: "#fff",
                    outline: "none", boxSizing: "border-box",
                  }}
                />
                <button
                  type="submit"
                  disabled={loading || !ready}
                  style={{
                    width: "100%", padding: 14, background: "#1D9E75", color: "#fff",
                    border: "none", borderRadius: 10, fontSize: 14, fontWeight: 500,
                    cursor: (loading || !ready) ? "not-allowed" : "pointer",
                    opacity: (loading || !ready) ? 0.6 : 1,
                  }}
                >
                  {loading ? "Updating..." : "Update password"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
