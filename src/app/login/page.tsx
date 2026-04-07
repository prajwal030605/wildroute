"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { resolveRoleFromCredentials, setSession } from "@/lib/auth-session";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const role = resolveRoleFromCredentials(email, password);
    if (!role) {
      setError(true);
      setPassword("");
      setTimeout(() => setError(false), 2800);
      return;
    }
    setSession({ role, email: email.trim() });
    if (role === "admin") router.push("/admin");
    else router.push("/");
  }

  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <Navbar />
      <section
        style={{
          paddingTop: 120,
          paddingBottom: 80,
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: 400, padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Image
              src="/WildRoute_PFP_Tilted.png"
              alt="WildRoute"
              width={52}
              height={52}
              style={{ borderRadius: "50%", marginBottom: 14 }}
            />
            <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>
              Log in to <span style={{ color: "#1D9E75" }}>WildRoute</span>
            </h1>
            <p style={{ color: "#555", fontSize: 13 }}>
              Use your admin or traveller credentials to continue.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            style={{
              background: "#111",
              border: `1px solid ${error ? "#EF4444" : "#1a1a1a"}`,
              borderRadius: 16,
              padding: 28,
            }}
          >
            {error && (
              <div
                style={{
                  background: "#2A0F0F",
                  border: "1px solid #EF4444",
                  borderRadius: 12,
                  padding: "12px 16px",
                  marginBottom: 20,
                  color: "#EF4444",
                  fontSize: 14,
                }}
              >
                Invalid email or password.
              </div>
            )}
            <label
              style={{
                display: "block",
                color: "#888",
                fontSize: 12,
                fontWeight: 500,
                marginBottom: 8,
              }}
            >
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="username"
              placeholder="you@example.com"
              required
              style={{
                width: "100%",
                background: "#0a0a0a",
                border: "1px solid #222",
                borderRadius: 10,
                padding: "12px 14px",
                fontSize: 14,
                color: "#fff",
                outline: "none",
                marginBottom: 16,
                boxSizing: "border-box",
              }}
            />
            <label
              style={{
                display: "block",
                color: "#888",
                fontSize: 12,
                fontWeight: 500,
                marginBottom: 8,
              }}
            >
              Password
            </label>
            <div
              style={{
                display: "flex",
                background: "#0a0a0a",
                border: "1px solid #222",
                borderRadius: 10,
                overflow: "hidden",
                marginBottom: 20,
              }}
            >
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={show ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                required
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  padding: "12px 14px",
                  fontSize: 14,
                  color: "#fff",
                  outline: "none",
                }}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0 14px",
                  color: "#444",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                background: "#1D9E75",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Log in
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: 22 }}>
            <Link href="/" style={{ color: "#444", fontSize: 12, textDecoration: "none" }}>
              ← Back to site
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
