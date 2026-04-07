"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/lib/supabase";
import { setSession, resolveRoleFromCredentials } from "@/lib/auth-session";

export default function AgencyAuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleEmailAuth() {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const trimmedEmail = email.trim().toLowerCase();

      // First check env-var test credentials (for local testing)
      const envRole = resolveRoleFromCredentials(email.trim(), password);
      if (envRole === "agency") {
        // Store in DB immediately
        const { error: dbError } = await supabase.from("agencies_directory").upsert(
          [{ email: trimmedEmail, onboarding_complete: false }],
          { onConflict: "email" }
        );
        if (dbError) {
          console.error("DB insert error:", dbError);
          setError("Registration saved locally but DB write failed: " + dbError.message);
        }
        setSession({ role: "agency", email: trimmedEmail });
        router.push("/register/agency/onboarding");
        return;
      }

      // Otherwise use Supabase Auth
      let authUserId: string | undefined;
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { role: "agency" } },
        });
        if (signUpError) {
          setError(signUpError.message);
          return;
        }
        authUserId = data.user?.id;
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) {
          setError(signInError.message);
          return;
        }
        authUserId = data.user?.id;
      }

      // Store in DB immediately on registration
      const { error: dbError } = await supabase.from("agencies_directory").upsert(
        [{ email: trimmedEmail, user_id: authUserId || null, onboarding_complete: false }],
        { onConflict: "email" }
      );
      if (dbError) {
        console.error("DB insert error:", dbError);
      }

      setSession({ role: "agency", email: trimmedEmail });
      router.push("/register/agency/onboarding");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleAuth() {
    setError("");
    setLoading(true);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/register/agency/onboarding`,
      },
    });
    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    background: "#111",
    border: "1px solid #222",
    borderRadius: 10,
    padding: "13px 16px",
    fontSize: 14,
    color: "#fff",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <Navbar />

      <section style={{
        paddingTop: 130, paddingBottom: 80,
        display: "flex", flexDirection: "column", alignItems: "center",
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(29,158,117,0.10) 0%, transparent 70%)",
        padding: "130px 24px 80px",
      }}>
        <Link href="/register" style={{ color: "#555", fontSize: 13, textDecoration: "none", marginBottom: 24 }}>
          ← Back to registration options
        </Link>

        <div style={{
          maxWidth: 420, width: "100%",
          background: "#111", border: "1px solid #1a1a1a", borderRadius: 20,
          padding: "36px 32px",
        }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, background: "#0F2A1E",
              border: "1px solid #1D9E75", display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 16px", fontSize: 24,
            }}>
              🏢
            </div>
            <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Agency Registration</h1>
            <p style={{ color: "#666", fontSize: 13 }}>
              {mode === "signup" ? "Create your agency account" : "Sign in to your agency account"}
            </p>
          </div>

          {/* Mode toggle */}
          <div style={{
            display: "flex", border: "1px solid #222", borderRadius: 10,
            overflow: "hidden", marginBottom: 24,
          }}>
            <button
              type="button"
              onClick={() => { setMode("signup"); setError(""); }}
              style={{
                flex: 1, padding: "10px 0", fontSize: 13, fontWeight: 500,
                cursor: "pointer", border: "none",
                background: mode === "signup" ? "#1D9E75" : "transparent",
                color: mode === "signup" ? "#fff" : "#666",
              }}
            >
              Sign up
            </button>
            <button
              type="button"
              onClick={() => { setMode("login"); setError(""); }}
              style={{
                flex: 1, padding: "10px 0", fontSize: 13, fontWeight: 500,
                cursor: "pointer", border: "none",
                background: mode === "login" ? "#1D9E75" : "transparent",
                color: mode === "login" ? "#fff" : "#666",
              }}
            >
              Log in
            </button>
          </div>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            style={{
              width: "100%", padding: "12px 16px",
              background: "#fff", color: "#333", border: "none", borderRadius: 10,
              fontSize: 14, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              marginBottom: 20, opacity: loading ? 0.6 : 1,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "#222" }} />
            <span style={{ color: "#444", fontSize: 12 }}>or</span>
            <div style={{ flex: 1, height: 1, background: "#222" }} />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 8, padding: "10px 14px", marginBottom: 16,
            }}>
              <p style={{ color: "#EF4444", fontSize: 13, margin: 0 }}>{error}</p>
            </div>
          )}

          {/* Email form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
            />
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "#555", fontSize: 12,
                  cursor: "pointer",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {mode === "signup" && (
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={inputStyle}
              />
            )}
          </div>

          <button
            type="button"
            onClick={handleEmailAuth}
            disabled={loading}
            style={{
              width: "100%", padding: 14,
              background: "#1D9E75", color: "#fff", border: "none", borderRadius: 10,
              fontSize: 14, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}
          </button>

          <p style={{ color: "#333", fontSize: 11, textAlign: "center", marginTop: 16 }}>
            {mode === "signup"
              ? "By signing up, you agree to our terms of service."
              : "Forgot your password? Contact support@wildroute.in"}
          </p>
        </div>
      </section>
    </main>
  );
}
