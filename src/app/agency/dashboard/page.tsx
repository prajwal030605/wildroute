"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth-session";

type Trek = {
  id: string;
  trek_name: string;
  trek_slug: string;
  difficulty: string;
  duration_days: number;
  price_per_person: number;
  cover_image: string;
  is_active: boolean;
};

type AgencyInfo = {
  agency_name: string;
  location: string;
  state_name: string;
  verified: boolean;
  onboarding_complete: boolean;
};

export default function AgencyDashboardPage() {
  const router = useRouter();
  const [treks, setTreks] = useState<Trek[]>([]);
  const [agency, setAgency] = useState<AgencyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const session = getSession();
    if (!session || session.role !== "agency") {
      router.push("/register/agency");
      return;
    }
    setEmail(session.email);
    fetchData(session.email);
  }, [router]);

  async function fetchData(agencyEmail: string) {
    setLoading(true);
    // Fetch agency info
    const { data: agencyData } = await supabase
      .from("agencies_directory")
      .select("agency_name, location, state_name, verified, onboarding_complete")
      .eq("email", agencyEmail)
      .single();

    if (agencyData) setAgency(agencyData as AgencyInfo);

    // Fetch agency treks
    const { data: trekData } = await supabase
      .from("agency_treks")
      .select("id, trek_name, trek_slug, difficulty, duration_days, price_per_person, cover_image, is_active")
      .eq("agency_email", agencyEmail)
      .order("created_at", { ascending: false });

    if (trekData) setTreks(trekData as Trek[]);
    setLoading(false);
  }

  const difficultyColor: Record<string, string> = {
    easy: "#4ade80", moderate: "#fbbf24", hard: "#f87171", challenging: "#f87171",
  };

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--wr-bg)", minHeight: "100vh", paddingTop: 80, transition: "background 0.2s" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 80px" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ color: "var(--wr-text)", fontSize: 26, fontWeight: 700, margin: "0 0 6px" }}>
                {agency?.agency_name || "Your Agency"}
              </h1>
              <p style={{ color: "var(--wr-text-muted)", fontSize: 14, margin: 0 }}>
                📍 {agency?.location}{agency?.state_name ? `, ${agency.state_name}` : ""} · {email}
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                <span style={{
                  background: agency?.verified ? "#0F2A1E" : "#1a1a1a",
                  color: agency?.verified ? "#1D9E75" : "#555",
                  fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.05em",
                }}>
                  {agency?.verified ? "✓ VERIFIED" : "⏳ PENDING VERIFICATION"}
                </span>
                <span style={{
                  background: agency?.onboarding_complete ? "#0F2A1E" : "#1a1a1a",
                  color: agency?.onboarding_complete ? "#1D9E75" : "#555",
                  fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.05em",
                }}>
                  {agency?.onboarding_complete ? "✓ PROFILE COMPLETE" : "⚠ COMPLETE YOUR PROFILE"}
                </span>
              </div>
            </div>

            <Link href="/register/agency/onboarding" style={{
              background: "var(--wr-green)", color: "#fff", padding: "10px 20px",
              borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              + Add New Trek
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 40 }}>
            {[
              { label: "Total Treks", value: treks.length },
              { label: "Active Treks", value: treks.filter(t => t.is_active).length },
              { label: "Starting From", value: treks.length ? `₹${Math.min(...treks.map(t => t.price_per_person)).toLocaleString("en-IN")}` : "—" },
            ].map(stat => (
              <div key={stat.label} style={{
                background: "var(--wr-card)", border: "1px solid var(--wr-border)",
                borderRadius: 12, padding: "20px 24px", transition: "background 0.2s",
              }}>
                <p style={{ color: "var(--wr-text-muted)", fontSize: 12, margin: "0 0 6px", fontWeight: 600, letterSpacing: "0.05em" }}>
                  {stat.label.toUpperCase()}
                </p>
                <p style={{ color: "var(--wr-green)", fontSize: 22, fontWeight: 700, margin: 0 }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Treks */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ color: "var(--wr-text)", fontSize: 18, fontWeight: 700, margin: "0 0 20px" }}>
              Your Listed Treks
            </h2>

            {loading ? (
              <p style={{ color: "var(--wr-text-muted)", fontSize: 14 }}>Loading...</p>
            ) : treks.length === 0 ? (
              <div style={{
                background: "var(--wr-card)", border: "1px dashed var(--wr-border)",
                borderRadius: 16, padding: "48px 24px", textAlign: "center",
              }}>
                <p style={{ fontSize: 32, margin: "0 0 12px" }}>🏔</p>
                <p style={{ color: "var(--wr-text)", fontWeight: 600, fontSize: 16, margin: "0 0 8px" }}>
                  No treks listed yet
                </p>
                <p style={{ color: "var(--wr-text-muted)", fontSize: 14, margin: "0 0 24px" }}>
                  Add your first trek to start getting enquiries from adventurers.
                </p>
                <Link href="/register/agency/onboarding" style={{
                  background: "var(--wr-green)", color: "#fff", padding: "12px 28px",
                  borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none",
                }}>
                  + Add Your First Trek
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {treks.map(trek => (
                  <div key={trek.id} style={{
                    background: "var(--wr-card)", border: "1px solid var(--wr-border)",
                    borderRadius: 14, overflow: "hidden", display: "flex", alignItems: "stretch",
                    transition: "border-color 0.2s, background 0.2s",
                  }}>
                    {trek.cover_image && (
                      <img src={trek.cover_image} alt={trek.trek_name}
                        style={{ width: 100, objectFit: "cover", flexShrink: 0 }} />
                    )}
                    <div style={{ padding: "16px 20px", flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                      <div>
                        <p style={{ color: "var(--wr-text)", fontWeight: 600, fontSize: 15, margin: "0 0 6px" }}>
                          {trek.trek_name}
                        </p>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          <span style={{
                            background: "var(--wr-card-hover)", color: difficultyColor[trek.difficulty?.toLowerCase()] || "var(--wr-text-muted)",
                            fontSize: 11, padding: "2px 8px", borderRadius: 6, fontWeight: 600,
                          }}>
                            {trek.difficulty}
                          </span>
                          <span style={{ color: "var(--wr-text-muted)", fontSize: 12 }}>
                            {trek.duration_days} days
                          </span>
                          <span style={{ color: "var(--wr-green)", fontSize: 12, fontWeight: 600 }}>
                            ₹{trek.price_per_person?.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{
                          background: trek.is_active ? "#0F2A1E" : "#1a1a1a",
                          color: trek.is_active ? "#1D9E75" : "#555",
                          fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                        }}>
                          {trek.is_active ? "● ACTIVE" : "○ INACTIVE"}
                        </span>
                        <Link href={`/trek/${trek.trek_slug}`} style={{
                          color: "var(--wr-green)", fontSize: 13, fontWeight: 500, textDecoration: "none",
                        }}>
                          View →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add more CTA */}
          {treks.length > 0 && (
            <div style={{
              background: "var(--wr-green-bg)", border: "1px solid var(--wr-green)",
              borderRadius: 14, padding: "24px 28px", display: "flex",
              justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16,
            }}>
              <div>
                <p style={{ color: "var(--wr-text)", fontWeight: 600, fontSize: 15, margin: "0 0 4px" }}>
                  Have more activities to offer?
                </p>
                <p style={{ color: "var(--wr-text-muted)", fontSize: 13, margin: 0 }}>
                  Add rafting, paragliding, camping or any other adventure you run.
                </p>
              </div>
              <Link href="/register/agency/onboarding" style={{
                background: "var(--wr-green)", color: "#fff", padding: "10px 22px",
                borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap",
              }}>
                + Add Activity
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
