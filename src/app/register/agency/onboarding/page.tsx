"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/lib/supabase";
import { getSession, setSession } from "@/lib/auth-session";
import type { ActivityType } from "@/types";

/* ── constants ── */
const activityOptions: { label: string; emoji: string; value: ActivityType }[] = [
  { label: "Trekking", emoji: "🥾", value: "trekking" },
  { label: "Rafting", emoji: "🚣", value: "rafting" },
  { label: "Paragliding", emoji: "🪂", value: "paragliding" },
  { label: "Bungee", emoji: "🪢", value: "bungee" },
  { label: "Camping", emoji: "⛺", value: "camping" },
  { label: "Cycling", emoji: "🚵", value: "cycling" },
  { label: "Skiing", emoji: "⛷️", value: "skiing" },
  { label: "Rock Climbing", emoji: "🧗", value: "rock-climbing" },
];

const indianStates = [
  "Himachal Pradesh", "Uttarakhand", "Jammu & Kashmir", "Ladakh",
  "Meghalaya", "Sikkim", "Arunachal Pradesh", "Karnataka",
  "Kerala", "Goa", "Rajasthan", "Maharashtra", "Tamil Nadu",
  "West Bengal", "Assam", "Nagaland", "Manipur", "Mizoram", "Tripura",
];

const difficultyLevels = [
  { label: "Easy", value: "easy", color: "#1D9E75", desc: "Suitable for beginners, minimal fitness required" },
  { label: "Moderate", value: "moderate", color: "#F59E0B", desc: "Some fitness required, prior experience helpful" },
  { label: "Hard", value: "hard", color: "#EF4444", desc: "Good fitness required, prior trekking experience needed" },
  { label: "Extreme", value: "extreme", color: "#7C3AED", desc: "Expert level, high altitude or technical terrain" },
];

const seasons = ["Spring (Mar-May)", "Summer (Jun-Aug)", "Autumn (Sep-Nov)", "Winter (Dec-Feb)", "Year-round"];

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function generateRegistrationId(): string {
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `WR-${rand}`;
}

/* ── styles ── */
const inputStyle = {
  width: "100%",
  background: "#0d0d0d",
  border: "1px solid #222",
  borderRadius: 10,
  padding: "13px 16px",
  fontSize: 14,
  color: "#fff",
  outline: "none",
  boxSizing: "border-box" as const,
};

const labelStyle = {
  color: "#aaa",
  fontSize: 12,
  fontWeight: 500 as const,
  marginBottom: 6,
  display: "block" as const,
};

const sectionTitle = (text: string) => (
  <p style={{ color: "#1D9E75", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 16, marginTop: 8 }}>{text}</p>
);

/* ── component ── */
export default function AgencyOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [registrationId, setRegistrationId] = useState("");

  /* ── Page 1: Agency Details ── */
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [foundedYear, setFoundedYear] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [panNo, setPanNo] = useState("");
  const [gstNo, setGstNo] = useState("");

  /* ── Page 2: Trek Details ── */
  const [trekName, setTrekName] = useState("");
  const [trekPhotos, setTrekPhotos] = useState("");
  const [trekDescription, setTrekDescription] = useState("");
  const [trekArea, setTrekArea] = useState("");
  const [trekAltitude, setTrekAltitude] = useState("");
  const [trekDuration, setTrekDuration] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [pastTrekPhotos, setPastTrekPhotos] = useState("");
  const [pastTrekCount, setPastTrekCount] = useState("");
  const [trekInclusions, setTrekInclusions] = useState("");
  const [trekExclusions, setTrekExclusions] = useState("");
  const [googleReviewsLink, setGoogleReviewsLink] = useState("");

  /* ── Page 3: Pricing & Logistics ── */
  const [pricePerPerson, setPricePerPerson] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [discountNote, setDiscountNote] = useState("");
  const [includesStay, setIncludesStay] = useState(false);
  const [stayType, setStayType] = useState("");
  const [includesFood, setIncludesFood] = useState(false);
  const [foodType, setFoodType] = useState("");
  const [includesGuide, setIncludesGuide] = useState(false);
  const [includesPermits, setIncludesPermits] = useState(false);
  const [excludesTransport, setExcludesTransport] = useState(true);
  const [excludesPersonal, setExcludesPersonal] = useState(true);
  const [difficulty, setDifficulty] = useState("");
  const [batchDates, setBatchDates] = useState("");
  const [season, setSeason] = useState<string[]>([]);

  useEffect(() => {
    const session = getSession();
    if (session?.email) setEmail(session.email);

    async function loadSupabaseUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
        if (!getSession()) setSession({ role: "agency", email: user.email });
      }

      // Check if agency already completed onboarding — if so, skip to Step 2
      const emailToCheck = session?.email || user?.email;
      if (emailToCheck) {
        const { data: agencyData } = await supabase
          .from("agencies_directory")
          .select("*")
          .eq("email", emailToCheck.trim().toLowerCase())
          .eq("onboarding_complete", true)
          .maybeSingle();

        if (agencyData) {
          // Pre-fill agency fields from existing record
          setName(agencyData.name || "");
          setLocation(agencyData.location || "");
          setState(agencyData.state || "");
          setAddress(agencyData.address || "");
          setDescription(agencyData.description || "");
          setActivities(agencyData.activities || []);
          setEmail(agencyData.email || emailToCheck);
          setPhone(agencyData.phone || "");
          setWebsite(agencyData.website || "");
          setFoundedYear(agencyData.founded_year?.toString() || "");
          setCoverImage(agencyData.cover_image || "");
          setPanNo(agencyData.pan_no || "");
          setGstNo(agencyData.gst_no || "");
          // Jump directly to trek details step
          setStep(2);
        }
      }
    }
    loadSupabaseUser();

    setRegistrationId(generateRegistrationId());
  }, []);

  function toggleActivity(activity: ActivityType) {
    setActivities(prev =>
      prev.includes(activity) ? prev.filter(a => a !== activity) : [...prev, activity]
    );
  }

  function toggleSeason(s: string) {
    setSeason(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  }

  /* ── Page 1 Save ── */
  async function savePage1() {
    setError("");
    if (!name.trim()) { setError("Agency name is required."); return; }
    if (!location.trim()) { setError("Location is required."); return; }
    if (!state) { setError("Please select a state."); return; }
    if (!address.trim()) { setError("Agency address is required."); return; }
    if (!description.trim() || description.trim().length < 20) { setError("Description must be at least 20 characters."); return; }
    if (activities.length === 0) { setError("Select at least one activity."); return; }
    if (!email.trim()) { setError("Email is required."); return; }
    if (!phone.trim()) { setError("Phone number is required."); return; }
    if (!panNo.trim() || !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panNo.trim().toUpperCase())) { setError("Valid PAN number is required (e.g. ABCDE1234F)."); return; }

    setLoading(true);
    try {
      const slug = generateSlug(name);
      const year = foundedYear ? parseInt(foundedYear, 10) : new Date().getFullYear();
      const trimmedEmail = email.trim().toLowerCase();
      const { data: { user: authUser } } = await supabase.auth.getUser();

      const { error: dbError } = await supabase.from("agencies_directory").upsert([{
        registration_id: registrationId,
        name: name.trim(),
        slug,
        location: location.trim(),
        state,
        address: address.trim(),
        description: description.trim(),
        activities,
        email: trimmedEmail,
        phone: phone.trim(),
        website: website.trim() || null,
        founded_year: year,
        cover_image: coverImage.trim() || null,
        pan_no: panNo.trim().toUpperCase(),
        gst_no: gstNo.trim().toUpperCase() || null,
        logo: "/WildRoute_PFP_Tilted.png",
        rating: 0,
        review_count: 0,
        verified: false,
        onboarding_step: 1,
        onboarding_complete: false,
        ...(authUser?.id ? { user_id: authUser.id } : {}),
      }], { onConflict: "email" });

      if (dbError) { setError("Save failed: " + dbError.message); return; }
      setStep(2);
    } finally {
      setLoading(false);
    }
  }

  /* ── Page 2 Save ── */
  async function savePage2() {
    setError("");
    if (!trekName.trim()) { setError("Trek name is required."); return; }
    if (!trekDescription.trim()) { setError("Trek description is required."); return; }
    if (!itinerary.trim()) { setError("Itinerary is required."); return; }

    setLoading(true);
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const trekSlug = generateSlug(trekName);

      const { error: trekError } = await supabase.from("agency_treks").upsert([{
        agency_email: trimmedEmail,
        registration_id: registrationId,
        trek_name: trekName.trim(),
        trek_slug: trekSlug,
        trek_photos: trekPhotos.split("\n").map(u => u.trim()).filter(Boolean),
        trek_description: trekDescription.trim(),
        trek_area: trekArea.trim(),
        trek_altitude: trekAltitude.trim(),
        trek_duration: trekDuration.trim(),
        itinerary: itinerary.trim(),
        past_trek_photos: pastTrekPhotos.split("\n").map(u => u.trim()).filter(Boolean),
        past_trek_count: pastTrekCount ? parseInt(pastTrekCount, 10) : 0,
        inclusions: trekInclusions.split("\n").map(l => l.trim()).filter(Boolean),
        exclusions: trekExclusions.split("\n").map(l => l.trim()).filter(Boolean),
        google_reviews_link: googleReviewsLink.trim() || null,
        onboarding_step: 2,
      }], { onConflict: "registration_id" });

      if (trekError) { setError("Save failed: " + trekError.message); return; }

      // Update agency step
      await supabase.from("agencies_directory")
        .update({ onboarding_step: 2 })
        .eq("email", trimmedEmail);

      setStep(3);
    } finally {
      setLoading(false);
    }
  }

  /* ── Page 3 Save (Final) ── */
  async function savePage3() {
    setError("");
    if (!pricePerPerson.trim()) { setError("Price per person is required."); return; }
    if (!difficulty) { setError("Please select a difficulty level."); return; }
    if (season.length === 0) { setError("Please select at least one season."); return; }

    setLoading(true);
    try {
      const trimmedEmail = email.trim().toLowerCase();

      const { error: trekError } = await supabase.from("agency_treks")
        .update({
          price_per_person: parseInt(pricePerPerson, 10),
          discount_percent: discountPercent ? parseInt(discountPercent, 10) : 0,
          discount_note: discountNote.trim() || null,
          includes_stay: includesStay,
          stay_type: stayType || null,
          includes_food: includesFood,
          food_type: foodType || null,
          includes_guide: includesGuide,
          includes_permits: includesPermits,
          excludes_transport: excludesTransport,
          excludes_personal: excludesPersonal,
          difficulty,
          batch_dates: batchDates.split("\n").map(l => l.trim()).filter(Boolean),
          season,
          onboarding_step: 3,
        })
        .eq("registration_id", registrationId);

      if (trekError) { setError("Save failed: " + trekError.message); return; }

      // Mark agency onboarding complete
      await supabase.from("agencies_directory")
        .update({ onboarding_step: 3, onboarding_complete: true })
        .eq("email", trimmedEmail);

      // Send registration confirmation email
      await fetch("/api/send-registration-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          agencyName: name,
          registrationId,
          trekName: trekName.trim() || null,
        }),
      });

      setSuccess(true);
    } finally {
      setLoading(false);
    }
  }

  /* ── Step indicator ── */
  function StepIndicator() {
    const steps = [
      { num: 1, label: "Agency Details" },
      { num: 2, label: "Trek Details" },
      { num: 3, label: "Pricing & Logistics" },
    ];
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 32 }}>
        {steps.map((s, i) => (
          <div key={s.num} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: step >= s.num ? "#1D9E75" : "#222",
                color: step >= s.num ? "#fff" : "#555",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, margin: "0 auto 6px",
                border: step === s.num ? "2px solid #2ecf9a" : "2px solid transparent",
              }}>
                {step > s.num ? "✓" : s.num}
              </div>
              <p style={{ color: step >= s.num ? "#ccc" : "#444", fontSize: 10, margin: 0, whiteSpace: "nowrap" }}>{s.label}</p>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 60, height: 2, background: step > s.num ? "#1D9E75" : "#222", margin: "0 8px", marginBottom: 18 }} />
            )}
          </div>
        ))}
      </div>
    );
  }

  /* ── Success screen ── */
  if (success) {
    return (
      <main style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "sans-serif" }}>
        <Navbar />
        <section style={{ paddingTop: 160, display: "flex", flexDirection: "column" as const, alignItems: "center", textAlign: "center", padding: "160px 24px 80px" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#0F2A1E", border: "2px solid #1D9E75", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28 }}>
            ✓
          </div>
          <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Registration complete!</h1>
          <p style={{ color: "#888", fontSize: 15, maxWidth: 460, lineHeight: 1.7, marginBottom: 8 }}>
            Your agency <strong style={{ color: "#1D9E75" }}>{name}</strong> has been registered successfully.
          </p>
          <p style={{ color: "#555", fontSize: 13, marginBottom: 32 }}>
            Registration ID: <strong style={{ color: "#1D9E75" }}>{registrationId}</strong> — Our team will review and verify your listing within 24-48 hours.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <button type="button" onClick={() => {
              // Reset only trek & pricing fields, keep agency data, go to Step 2
              setTrekName(""); setTrekPhotos(""); setTrekDescription("");
              setTrekArea(""); setTrekAltitude(""); setTrekDuration("");
              setItinerary(""); setPastTrekPhotos(""); setPastTrekCount("");
              setTrekInclusions(""); setTrekExclusions(""); setGoogleReviewsLink("");
              setPricePerPerson(""); setDiscountPercent(""); setDiscountNote("");
              setIncludesStay(false); setStayType(""); setIncludesFood(false);
              setFoodType(""); setIncludesGuide(false); setIncludesPermits(false);
              setExcludesTransport(true); setExcludesPersonal(true);
              setDifficulty(""); setBatchDates(""); setSeason([]);
              setRegistrationId(generateRegistrationId());
              setError("");
              setSuccess(false);
              setStep(2);
            }} style={{ background: "#1D9E75", color: "#fff", padding: "12px 28px", borderRadius: 8, fontSize: 14, fontWeight: 500, border: "none", cursor: "pointer" }}>
              + Add Another Trek
            </button>
            <button type="button" onClick={() => router.push("/")} style={{ background: "transparent", color: "#ccc", padding: "12px 28px", borderRadius: 8, fontSize: 14, fontWeight: 500, border: "1px solid #444", cursor: "pointer" }}>
              Go to homepage
            </button>
            <button type="button" onClick={() => router.push("/explore")} style={{ background: "transparent", color: "#888", padding: "12px 28px", borderRadius: 8, fontSize: 14, fontWeight: 500, border: "1px solid #333", cursor: "pointer" }}>
              Explore adventures
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <Navbar />

      <section style={{
        paddingTop: 120, paddingBottom: 80,
        display: "flex", flexDirection: "column", alignItems: "center",
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(29,158,117,0.10) 0%, transparent 70%)",
        padding: "120px 24px 80px",
      }}>
        <div style={{ maxWidth: 640, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <span style={{ border: "1px solid #1D9E75", color: "#1D9E75", fontSize: 11, padding: "5px 16px", borderRadius: 20, display: "inline-block", marginBottom: 16, background: "rgba(29,158,117,0.08)" }}>
              AGENCY ONBOARDING — STEP {step} OF 3
            </span>
            {registrationId && (
              <p style={{ color: "#444", fontSize: 11 }}>Registration ID: {registrationId}</p>
            )}
          </div>

          <StepIndicator />

          <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 20, padding: "32px 28px" }}>
            {error && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 20 }}>
                <p style={{ color: "#EF4444", fontSize: 13, margin: 0 }}>{error}</p>
              </div>
            )}

            {/* ════════════ PAGE 1: Agency Details ════════════ */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 0 4px 0" }}>Agency Details</h2>
                <p style={{ color: "#555", fontSize: 13, margin: "0 0 20px 0" }}>Basic information about your agency. Fields marked * are required.</p>

                {/* ── Section: Identity ── */}
                <div style={{ background: "#0a0a0a", borderRadius: 14, padding: "20px 18px", marginBottom: 16, border: "1px solid #1a1a1a" }}>
                  {sectionTitle("AGENCY IDENTITY")}
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div>
                      <label style={labelStyle}>Agency Name *</label>
                      <input type="text" placeholder="e.g. Himalayan Trails" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
                      {name && <p style={{ color: "#444", fontSize: 11, marginTop: 4 }}>URL: wildroute.com/agency/{generateSlug(name)}</p>}
                    </div>
                    <div>
                      <label style={labelStyle}>About your agency *</label>
                      <textarea placeholder="What makes your agency special? (min 20 characters)" value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" as const }} />
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      <label style={{ ...labelStyle, width: "100%" }}>Activities you offer *</label>
                      {activityOptions.map(a => {
                        const selected = activities.includes(a.value);
                        return (
                          <button key={a.value} type="button" onClick={() => toggleActivity(a.value)} style={{
                            background: selected ? "rgba(29,158,117,0.15)" : "#111",
                            border: `1px solid ${selected ? "#1D9E75" : "#222"}`,
                            color: selected ? "#1D9E75" : "#888",
                            padding: "7px 12px", borderRadius: 20, fontSize: 12,
                            cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                          }}>
                            {a.emoji} {a.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ── Section: Location ── */}
                <div style={{ background: "#0a0a0a", borderRadius: 14, padding: "20px 18px", marginBottom: 16, border: "1px solid #1a1a1a" }}>
                  {sectionTitle("LOCATION & ADDRESS")}
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label style={labelStyle}>City / Location *</label>
                        <input type="text" placeholder="e.g. Manali" value={location} onChange={e => setLocation(e.target.value)} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>State *</label>
                        <select value={state} onChange={e => setState(e.target.value)} style={{ ...inputStyle, cursor: "pointer", appearance: "auto" as const }}>
                          <option value="">Select state</option>
                          {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Full Address *</label>
                      <textarea placeholder="Street address with PIN code" value={address} onChange={e => setAddress(e.target.value)} rows={2} style={{ ...inputStyle, resize: "vertical" as const }} />
                    </div>
                  </div>
                </div>

                {/* ── Section: Contact ── */}
                <div style={{ background: "#0a0a0a", borderRadius: 14, padding: "20px 18px", marginBottom: 16, border: "1px solid #1a1a1a" }}>
                  {sectionTitle("CONTACT & VERIFICATION")}
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label style={labelStyle}>Email *</label>
                        <input type="email" placeholder="contact@agency.in" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Phone *</label>
                        <input type="tel" placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label style={labelStyle}>PAN Number *</label>
                        <input type="text" placeholder="e.g. ABCDE1234F" value={panNo} onChange={e => setPanNo(e.target.value.toUpperCase())} maxLength={10} style={{ ...inputStyle, textTransform: "uppercase" as const }} />
                      </div>
                      <div>
                        <label style={labelStyle}>GST Number <span style={{ color: "#444" }}>(optional)</span></label>
                        <input type="text" placeholder="e.g. 22ABCDE1234F1Z5" value={gstNo} onChange={e => setGstNo(e.target.value.toUpperCase())} maxLength={15} style={{ ...inputStyle, textTransform: "uppercase" as const }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Section: Optional extras ── */}
                <div style={{ background: "#0a0a0a", borderRadius: 14, padding: "20px 18px", marginBottom: 16, border: "1px solid #1a1a1a" }}>
                  {sectionTitle("ADDITIONAL INFO (OPTIONAL)")}
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label style={labelStyle}>Website</label>
                        <input type="url" placeholder="https://youragency.in" value={website} onChange={e => setWebsite(e.target.value)} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Founded Year</label>
                        <input type="number" placeholder="e.g. 2015" value={foundedYear} onChange={e => setFoundedYear(e.target.value)} min={1990} max={2026} style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Cover Image URL</label>
                      <input type="url" placeholder="https://images.unsplash.com/..." value={coverImage} onChange={e => setCoverImage(e.target.value)} style={inputStyle} />
                      <p style={{ color: "#444", fontSize: 11, marginTop: 4 }}>Landscape image recommended (1200x600+).</p>
                    </div>
                  </div>
                </div>

                <button type="button" onClick={savePage1} disabled={loading} style={{
                  width: "100%", padding: 14, marginTop: 4,
                  background: "#1D9E75", color: "#fff", border: "none", borderRadius: 10,
                  fontSize: 14, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                }}>
                  {loading ? "Saving..." : "Next — Trek Details →"}
                </button>
              </div>
            )}

            {/* ════════════ PAGE 2: Trek Details ════════════ */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0 }}>Trek Details</h2>
                <p style={{ color: "#555", fontSize: 13, margin: 0 }}>Add your primary trek/activity that you want to list on WildRoute.</p>

                {sectionTitle("TREK INFORMATION")}
                <div>
                  <label style={labelStyle}>Trek Name *</label>
                  <input type="text" placeholder="e.g. Hampta Pass Trek" value={trekName} onChange={e => setTrekName(e.target.value)} style={inputStyle} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Area / Region</label>
                    <input type="text" placeholder="e.g. Kullu-Manali, Himachal" value={trekArea} onChange={e => setTrekArea(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Max Altitude</label>
                    <input type="text" placeholder="e.g. 14,100 ft" value={trekAltitude} onChange={e => setTrekAltitude(e.target.value)} style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Duration</label>
                  <input type="text" placeholder="e.g. 5 Days / 4 Nights" value={trekDuration} onChange={e => setTrekDuration(e.target.value)} style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Trek Description *</label>
                  <textarea placeholder="Describe the trek — terrain, highlights, what makes it special..." value={trekDescription} onChange={e => setTrekDescription(e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical" as const }} />
                </div>

                {sectionTitle("PHOTOGRAPHS")}
                <div>
                  <label style={labelStyle}>Trek Photo URLs (one per line)</label>
                  <textarea placeholder={"https://images.unsplash.com/photo-1.jpg\nhttps://images.unsplash.com/photo-2.jpg"} value={trekPhotos} onChange={e => setTrekPhotos(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" as const }} />
                  <p style={{ color: "#444", fontSize: 11, marginTop: 4 }}>Add image URLs showcasing this trek. One URL per line.</p>
                </div>

                {sectionTitle("ITINERARY")}
                <div>
                  <label style={labelStyle}>Day-wise Itinerary *</label>
                  <textarea
                    placeholder={"Day 1: Arrive at Manali, acclimatize\nDay 2: Drive to Jobra, trek to Chika (10,100 ft)\nDay 3: Trek to Balu Ka Ghera (11,900 ft)\nDay 4: Cross Hampta Pass (14,100 ft), camp at Shea Goru\nDay 5: Trek to Chatru, drive back to Manali"}
                    value={itinerary}
                    onChange={e => setItinerary(e.target.value)}
                    rows={6}
                    style={{ ...inputStyle, resize: "vertical" as const }}
                  />
                </div>

                {sectionTitle("PAST TREK COMPLETIONS")}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Total past completions</label>
                    <input type="number" placeholder="e.g. 45" value={pastTrekCount} onChange={e => setPastTrekCount(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Past trek photo URLs (one per line)</label>
                    <textarea placeholder="URLs of photos from past batches" value={pastTrekPhotos} onChange={e => setPastTrekPhotos(e.target.value)} rows={2} style={{ ...inputStyle, resize: "vertical" as const }} />
                  </div>
                </div>

                {sectionTitle("INCLUSIONS / EXCLUSIONS")}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>What&apos;s included (one per line)</label>
                    <textarea placeholder={"Meals during trek\nCamping gear\nFirst aid kit\nCertified guide"} value={trekInclusions} onChange={e => setTrekInclusions(e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical" as const }} />
                  </div>
                  <div>
                    <label style={labelStyle}>What&apos;s excluded (one per line)</label>
                    <textarea placeholder={"Personal insurance\nTransport to base\nPersonal gear\nTips"} value={trekExclusions} onChange={e => setTrekExclusions(e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical" as const }} />
                  </div>
                </div>

                {sectionTitle("REVIEWS")}
                <div>
                  <label style={labelStyle}>Google Reviews Link (optional)</label>
                  <input type="url" placeholder="https://maps.google.com/..." value={googleReviewsLink} onChange={e => setGoogleReviewsLink(e.target.value)} style={inputStyle} />
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                  <button type="button" onClick={() => { setStep(1); setError(""); }} style={{
                    padding: "14px 24px", background: "transparent", color: "#888",
                    border: "1px solid #333", borderRadius: 10, fontSize: 14, cursor: "pointer",
                  }}>
                    ← Back
                  </button>
                  <button type="button" onClick={savePage2} disabled={loading} style={{
                    flex: 1, padding: 14,
                    background: "#1D9E75", color: "#fff", border: "none", borderRadius: 10,
                    fontSize: 14, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1,
                  }}>
                    {loading ? "Saving..." : "Next — Pricing & Logistics →"}
                  </button>
                </div>
              </div>
            )}

            {/* ════════════ PAGE 3: Pricing & Logistics ════════════ */}
            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0 }}>Pricing & Logistics</h2>
                <p style={{ color: "#555", fontSize: 13, margin: 0 }}>Set your pricing, inclusions, and availability details.</p>

                {sectionTitle("PRICING")}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Price per person (INR) *</label>
                    <input type="number" placeholder="e.g. 8500" value={pricePerPerson} onChange={e => setPricePerPerson(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Discount % (if any)</label>
                    <input type="number" placeholder="e.g. 10" value={discountPercent} onChange={e => setDiscountPercent(e.target.value)} min={0} max={100} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Discount Note (optional)</label>
                  <input type="text" placeholder="e.g. Early bird 10% off for bookings before May 15" value={discountNote} onChange={e => setDiscountNote(e.target.value)} style={inputStyle} />
                </div>

                {sectionTitle("INCLUSIONS")}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {/* Stay */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#ccc", fontSize: 14 }}>
                      <input type="checkbox" checked={includesStay} onChange={e => setIncludesStay(e.target.checked)} style={{ accentColor: "#1D9E75", width: 16, height: 16 }} />
                      Stay (hotel/camp)
                    </label>
                    {includesStay && (
                      <div style={{ display: "flex", gap: 8 }}>
                        {["Hotel", "Camp/Tent", "Homestay", "Mixed"].map(t => (
                          <button key={t} type="button" onClick={() => setStayType(t)} style={{
                            padding: "5px 12px", borderRadius: 16, fontSize: 11,
                            background: stayType === t ? "rgba(29,158,117,0.15)" : "#0d0d0d",
                            border: `1px solid ${stayType === t ? "#1D9E75" : "#222"}`,
                            color: stayType === t ? "#1D9E75" : "#888", cursor: "pointer",
                          }}>
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Food */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#ccc", fontSize: 14 }}>
                      <input type="checkbox" checked={includesFood} onChange={e => setIncludesFood(e.target.checked)} style={{ accentColor: "#1D9E75", width: 16, height: 16 }} />
                      Food
                    </label>
                    {includesFood && (
                      <div style={{ display: "flex", gap: 8 }}>
                        {["Veg only", "Non-veg only", "Both veg & non-veg"].map(t => (
                          <button key={t} type="button" onClick={() => setFoodType(t)} style={{
                            padding: "5px 12px", borderRadius: 16, fontSize: 11,
                            background: foodType === t ? "rgba(29,158,117,0.15)" : "#0d0d0d",
                            border: `1px solid ${foodType === t ? "#1D9E75" : "#222"}`,
                            color: foodType === t ? "#1D9E75" : "#888", cursor: "pointer",
                          }}>
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Guide */}
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#ccc", fontSize: 14 }}>
                    <input type="checkbox" checked={includesGuide} onChange={e => setIncludesGuide(e.target.checked)} style={{ accentColor: "#1D9E75", width: 16, height: 16 }} />
                    Certified Guide
                  </label>

                  {/* Permits */}
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#ccc", fontSize: 14 }}>
                    <input type="checkbox" checked={includesPermits} onChange={e => setIncludesPermits(e.target.checked)} style={{ accentColor: "#1D9E75", width: 16, height: 16 }} />
                    Permits & Entry Fees
                  </label>
                </div>

                {sectionTitle("EXCLUSIONS")}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#ccc", fontSize: 14 }}>
                    <input type="checkbox" checked={excludesTransport} onChange={e => setExcludesTransport(e.target.checked)} style={{ accentColor: "#EF4444", width: 16, height: 16 }} />
                    Transport to/from base (not included)
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#ccc", fontSize: 14 }}>
                    <input type="checkbox" checked={excludesPersonal} onChange={e => setExcludesPersonal(e.target.checked)} style={{ accentColor: "#EF4444", width: 16, height: 16 }} />
                    Personal expenses (not included)
                  </label>
                </div>

                {sectionTitle("DIFFICULTY LEVEL")}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {difficultyLevels.map(d => (
                    <button key={d.value} type="button" onClick={() => setDifficulty(d.value)} style={{
                      padding: "14px 16px", borderRadius: 12, textAlign: "left",
                      background: difficulty === d.value ? `${d.color}15` : "#0d0d0d",
                      border: `1px solid ${difficulty === d.value ? d.color : "#222"}`,
                      cursor: "pointer",
                    }}>
                      <p style={{ color: d.color, fontSize: 13, fontWeight: 600, margin: "0 0 4px 0" }}>{d.label}</p>
                      <p style={{ color: "#555", fontSize: 11, margin: 0 }}>{d.desc}</p>
                    </button>
                  ))}
                </div>

                {sectionTitle("BATCH AVAILABILITY")}
                <div>
                  <label style={labelStyle}>Upcoming Batch Dates (one per line)</label>
                  <textarea placeholder={"15 May 2026 - 20 May 2026\n1 Jun 2026 - 6 Jun 2026\n15 Jun 2026 - 20 Jun 2026"} value={batchDates} onChange={e => setBatchDates(e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical" as const }} />
                </div>

                {sectionTitle("SEASON")}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {seasons.map(s => {
                    const selected = season.includes(s);
                    return (
                      <button key={s} type="button" onClick={() => toggleSeason(s)} style={{
                        padding: "8px 14px", borderRadius: 20, fontSize: 12,
                        background: selected ? "rgba(29,158,117,0.15)" : "#0d0d0d",
                        border: `1px solid ${selected ? "#1D9E75" : "#222"}`,
                        color: selected ? "#1D9E75" : "#888", cursor: "pointer",
                      }}>
                        {s}
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                  <button type="button" onClick={() => { setStep(2); setError(""); }} style={{
                    padding: "14px 24px", background: "transparent", color: "#888",
                    border: "1px solid #333", borderRadius: 10, fontSize: 14, cursor: "pointer",
                  }}>
                    ← Back
                  </button>
                  <button type="button" onClick={savePage3} disabled={loading} style={{
                    flex: 1, padding: 14,
                    background: "#1D9E75", color: "#fff", border: "none", borderRadius: 10,
                    fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1,
                  }}>
                    {loading ? "Registering..." : "Register My Agency ✓"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
