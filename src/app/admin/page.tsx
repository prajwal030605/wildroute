"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getSession, setSession, clearSession, resolveRoleFromCredentials } from "@/lib/auth-session";
import { ActivityType } from "@/types";

// ── Constants ──
const ALL_ACTIVITIES: ActivityType[] = [
  "trekking", "rafting", "paragliding", "bungee", "camping", "cycling", "skiing", "rock-climbing",
];
const STATES = [
  "Uttarakhand", "Himachal Pradesh", "Ladakh", "Meghalaya", "Sikkim",
  "Arunachal Pradesh", "Goa", "Kerala", "Rajasthan", "West Bengal", "Other",
];
const activityEmoji: Record<string, string> = {
  trekking: "🥾", rafting: "🚣", paragliding: "🪂", bungee: "🪢",
  camping: "⛺", cycling: "🚵", skiing: "⛷️", "rock-climbing": "🧗",
};
const inputStyle: React.CSSProperties = {
  width: "100%", background: "#111", border: "1px solid #222", borderRadius: 10,
  padding: "11px 14px", fontSize: 14, color: "#fff", outline: "none",
  boxSizing: "border-box", transition: "border-color 0.2s",
};
function slugify(t: string) {
  return t.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

// ── Helper components ──
function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <h2 style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: 0 }}>{title}</h2>
        <div style={{ flex: 1, height: 1, background: "#1a1a1a" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>
    </div>
  );
}
function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label style={{ display: "block", color: "#888", fontSize: 12, fontWeight: 500, marginBottom: 7 }}>
        {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
      </label>
      {children}
    </div>
  );
}
function Banner({ type, message }: { type: "success" | "error"; message: string }) {
  const isSuccess = type === "success";
  return (
    <div style={{
      background: isSuccess ? "#0F2A1E" : "#2A0F0F",
      border: `1px solid ${isSuccess ? "#1D9E75" : "#EF4444"}`,
      borderRadius: 12, padding: "14px 20px", marginBottom: 24,
      display: "flex", alignItems: "center", gap: 10,
    }}>
      <span style={{ color: isSuccess ? "#1D9E75" : "#EF4444", fontSize: 16 }}>{isSuccess ? "✓" : "⚠"}</span>
      <p style={{ color: isSuccess ? "#1D9E75" : "#EF4444", fontSize: 14, margin: 0 }}>{message}</p>
    </div>
  );
}

// ── Admin access gate with built-in login ──
function AdminAccessGate({ reason, onUnlock }: { reason: "none" | "user"; onUnlock: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {
    setError("");
    const role = resolveRoleFromCredentials(email, password);
    if (role === "admin") {
      setSession({ role: "admin", email: email.trim().toLowerCase() });
      onUnlock();
    } else {
      setError("Invalid admin credentials.");
    }
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 380, padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Image src="/WildRoute_PFP_Tilted.png" alt="WildRoute" width={52} height={52} style={{ borderRadius: "50%", marginBottom: 14 }} />
          <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>Wild<span style={{ color: "#1D9E75" }}>Route</span> Admin</h1>
          <p style={{ color: "#666", fontSize: 14, lineHeight: 1.5 }}>
            {reason === "user" ? "You're signed in as a traveller. Enter admin credentials below." : "Sign in to access the admin dashboard."}
          </p>
        </div>
        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
            <p style={{ color: "#EF4444", fontSize: 13, margin: 0 }}>{error}</p>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input type="email" placeholder="Admin email" value={email} onChange={e => setEmail(e.target.value)}
            style={{ width: "100%", background: "#111", border: "1px solid #222", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#fff", outline: "none", boxSizing: "border-box" }}
          />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={{ width: "100%", background: "#111", border: "1px solid #222", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#fff", outline: "none", boxSizing: "border-box" }}
          />
          <button type="button" onClick={handleLogin} style={{
            width: "100%", padding: 12, background: "#1D9E75", color: "#fff",
            borderRadius: 10, fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer",
          }}>
            Sign in
          </button>
          <Link href="/" style={{ display: "block", textAlign: "center", color: "#444", fontSize: 13, textDecoration: "none", marginTop: 4 }}>
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Add Agency Form ──
function AddAgencyForm() {
  type AgencyForm = { name: string; location: string; state: string; description: string; email: string; phone: string; website: string; foundedYear: string; activities: ActivityType[]; coverImage: string; };
  const empty: AgencyForm = { name: "", location: "", state: "", description: "", email: "", phone: "", website: "", foundedYear: "", activities: [], coverImage: "" };
  const [form, setForm] = useState<AgencyForm>(empty);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function set(field: keyof AgencyForm, value: string) { setForm((f) => ({ ...f, [field]: value })); }
  function toggleActivity(act: ActivityType) {
    setForm((f) => ({ ...f, activities: f.activities.includes(act) ? f.activities.filter((a) => a !== act) : [...f.activities, act] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    if (!form.name || !form.email || !form.state || !form.location) { setError("Please fill in all required fields."); return; }
    if (form.activities.length === 0) { setError("Please select at least one activity."); return; }
    setSaving(true);
    const { error: sbError } = await supabase.from("agencies_directory").insert([{
      name: form.name, slug: slugify(form.name), location: form.location, state: form.state,
      description: form.description, email: form.email, phone: form.phone,
      website: form.website || null, founded_year: form.foundedYear ? parseInt(form.foundedYear) : null,
      activities: form.activities, cover_image: form.coverImage || null,
      verified: false, rating: 0, review_count: 0,
    }]);
    setSaving(false);
    if (sbError) { setError(`Failed to save: ${sbError.message}`); }
    else { setSuccess(true); setForm(empty); setTimeout(() => setSuccess(false), 4000); }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Add new agency</h1>
        <p style={{ color: "#555", fontSize: 14 }}>Fill in the details to add a new adventure agency to WildRoute.</p>
      </div>
      {success && <Banner type="success" message="Agency added successfully!" />}
      {error && <Banner type="error" message={error} />}
      <form onSubmit={handleSubmit}>
        <FormSection title="Basic information">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Agency name" required>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Himalayan Trails" style={inputStyle} />
            </Field>
            <Field label="Auto-generated slug">
              <div style={{ ...inputStyle, color: "#555", display: "flex", alignItems: "center" }}>
                {form.name ? slugify(form.name) : <span style={{ color: "#333" }}>generated from name</span>}
              </div>
            </Field>
            <Field label="City / Location" required>
              <input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Manali" style={inputStyle} />
            </Field>
            <Field label="State" required>
              <select value={form.state} onChange={(e) => set("state", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="">Select state</option>
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Founded year">
              <input value={form.foundedYear} onChange={(e) => set("foundedYear", e.target.value)} type="number" placeholder="e.g. 2012" min="1990" max="2025" style={inputStyle} />
            </Field>
          </div>
          <Field label="Description">
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
              placeholder="What makes this agency special?" rows={4} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
          </Field>
        </FormSection>

        <FormSection title="Activities offered">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {ALL_ACTIVITIES.map((act) => {
              const sel = form.activities.includes(act);
              return (
                <button type="button" key={act} onClick={() => toggleActivity(act)} style={{
                  padding: "9px 16px", borderRadius: 30, fontSize: 13, cursor: "pointer",
                  border: sel ? "1px solid #1D9E75" : "1px solid #222",
                  background: sel ? "#0F2A1E" : "#111", color: sel ? "#1D9E75" : "#666", fontWeight: sel ? 600 : 400,
                }}>
                  {activityEmoji[act]} {act.charAt(0).toUpperCase() + act.slice(1)}
                </button>
              );
            })}
          </div>
        </FormSection>

        <FormSection title="Contact details">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Email" required><input value={form.email} onChange={(e) => set("email", e.target.value)} type="email" placeholder="info@agency.com" style={inputStyle} /></Field>
            <Field label="Phone"><input value={form.phone} onChange={(e) => set("phone", e.target.value)} type="tel" placeholder="+91 98765 43210" style={inputStyle} /></Field>
            <Field label="Website"><input value={form.website} onChange={(e) => set("website", e.target.value)} type="url" placeholder="https://agency.com" style={inputStyle} /></Field>
            <Field label="Cover image URL"><input value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} type="url" placeholder="https://..." style={inputStyle} /></Field>
          </div>
          {form.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.coverImage} alt="preview" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 10, border: "1px solid #222", marginTop: 12 }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          )}
        </FormSection>

        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit" disabled={saving} style={{ background: "#1D9E75", color: "#fff", border: "none", borderRadius: 10, padding: "13px 28px", fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving..." : "Add agency →"}
          </button>
          <button type="button" onClick={() => { setForm(empty); setError(""); }} style={{ background: "transparent", color: "#555", border: "1px solid #222", borderRadius: 10, padding: "13px 20px", fontSize: 14, cursor: "pointer" }}>
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Add Trek Form ──
function AddTrekForm() {
  type TrekForm = {
    title: string; agencySlug: string; destination: string; state: string;
    activityType: string; difficulty: string; duration: string; price: string;
    maxGroupSize: string; minAge: string; description: string;
    highlights: string; includes: string; imageUrl: string; bestSeason: string; altitude: string;
  };
  const empty: TrekForm = {
    title: "", agencySlug: "", destination: "", state: "", activityType: "",
    difficulty: "", duration: "", price: "", maxGroupSize: "", minAge: "",
    description: "", highlights: "", includes: "", imageUrl: "", bestSeason: "", altitude: "",
  };
  const [form, setForm] = useState<TrekForm>(empty);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function set(field: keyof TrekForm, value: string) { setForm((f) => ({ ...f, [field]: value })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    if (!form.title || !form.agencySlug || !form.destination || !form.activityType || !form.difficulty || !form.price) {
      setError("Please fill in all required fields."); return;
    }
    setSaving(true);
    const { error: sbError } = await supabase.from("treks_directory").insert([{
      title: form.title,
      slug: slugify(form.title),
      agency_slug: form.agencySlug,
      destination: form.destination,
      state: form.state,
      activity_type: form.activityType,
      difficulty: form.difficulty,
      duration: form.duration,
      price: parseInt(form.price),
      max_group_size: form.maxGroupSize ? parseInt(form.maxGroupSize) : null,
      min_age: form.minAge ? parseInt(form.minAge) : null,
      description: form.description,
      highlights: form.highlights ? form.highlights.split("\n").map((h) => h.trim()).filter(Boolean) : [],
      includes: form.includes ? form.includes.split("\n").map((i) => i.trim()).filter(Boolean) : [],
      images: form.imageUrl ? [form.imageUrl] : [],
      best_season: form.bestSeason,
      altitude: form.altitude || null,
      rating: 0, review_count: 0,
    }]);
    setSaving(false);
    if (sbError) { setError(`Failed to save: ${sbError.message}`); }
    else { setSuccess(true); setForm(empty); setTimeout(() => setSuccess(false), 4000); }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Add new trek</h1>
        <p style={{ color: "#555", fontSize: 14 }}>Add a trek or activity to an existing agency.</p>
      </div>
      {success && <Banner type="success" message="Trek added successfully!" />}
      {error && <Banner type="error" message={error} />}
      <form onSubmit={handleSubmit}>
        <FormSection title="Basic details">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Trek title" required>
              <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Hampta Pass Trek" style={inputStyle} />
            </Field>
            <Field label="Auto-generated slug">
              <div style={{ ...inputStyle, color: "#555", display: "flex", alignItems: "center" }}>
                {form.title ? slugify(form.title) : <span style={{ color: "#333" }}>generated from title</span>}
              </div>
            </Field>
            <Field label="Agency slug" required>
              <input value={form.agencySlug} onChange={(e) => set("agencySlug", e.target.value)} placeholder="e.g. himalayan-trails" style={inputStyle} />
            </Field>
            <Field label="Activity type" required>
              <select value={form.activityType} onChange={(e) => set("activityType", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="">Select activity</option>
                {ALL_ACTIVITIES.map((a) => <option key={a} value={a}>{activityEmoji[a]} {a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
              </select>
            </Field>
            <Field label="Destination" required>
              <input value={form.destination} onChange={(e) => set("destination", e.target.value)} placeholder="e.g. Hampta Pass" style={inputStyle} />
            </Field>
            <Field label="State">
              <select value={form.state} onChange={(e) => set("state", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="">Select state</option>
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Description">
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
              placeholder="Describe the trek — what makes it special, what trekkers will experience..." rows={4}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
          </Field>
        </FormSection>

        <FormSection title="Trek specs">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Difficulty" required>
              <select value={form.difficulty} onChange={(e) => set("difficulty", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="">Select difficulty</option>
                <option value="easy">🟢 Easy</option>
                <option value="moderate">🟡 Moderate</option>
                <option value="hard">🔴 Hard</option>
                <option value="extreme">🟣 Extreme</option>
              </select>
            </Field>
            <Field label="Duration">
              <input value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="e.g. 5 Days / 4 Nights" style={inputStyle} />
            </Field>
            <Field label="Price per person (₹)" required>
              <input value={form.price} onChange={(e) => set("price", e.target.value)} type="number" placeholder="e.g. 8500" min="0" style={inputStyle} />
            </Field>
            <Field label="Max group size">
              <input value={form.maxGroupSize} onChange={(e) => set("maxGroupSize", e.target.value)} type="number" placeholder="e.g. 15" min="1" style={inputStyle} />
            </Field>
            <Field label="Minimum age">
              <input value={form.minAge} onChange={(e) => set("minAge", e.target.value)} type="number" placeholder="e.g. 14" min="5" style={inputStyle} />
            </Field>
            <Field label="Best season">
              <input value={form.bestSeason} onChange={(e) => set("bestSeason", e.target.value)} placeholder="e.g. June – September" style={inputStyle} />
            </Field>
            <Field label="Max altitude">
              <input value={form.altitude} onChange={(e) => set("altitude", e.target.value)} placeholder="e.g. 14,100 ft" style={inputStyle} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Highlights & inclusions">
          <Field label="Highlights (one per line)">
            <textarea value={form.highlights} onChange={(e) => set("highlights", e.target.value)}
              placeholder={"14,100 ft high pass\nChandrataal Lake\nGlacier views"} rows={4}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.8 }} />
          </Field>
          <Field label="What's included (one per line)">
            <textarea value={form.includes} onChange={(e) => set("includes", e.target.value)}
              placeholder={"Transport from Manali\nTents & sleeping bags\nAll meals on trek\nCertified guide"} rows={4}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.8 }} />
          </Field>
        </FormSection>

        <FormSection title="Media">
          <Field label="Cover image URL">
            <input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} type="url" placeholder="https://..." style={inputStyle} />
          </Field>
          {form.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.imageUrl} alt="preview" style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 10, border: "1px solid #222" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          )}
        </FormSection>

        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit" disabled={saving} style={{ background: "#1D9E75", color: "#fff", border: "none", borderRadius: 10, padding: "13px 28px", fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving..." : "Add trek →"}
          </button>
          <button type="button" onClick={() => { setForm(empty); setError(""); }} style={{ background: "transparent", color: "#555", border: "1px solid #222", borderRadius: 10, padding: "13px 20px", fontSize: 14, cursor: "pointer" }}>
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Agency List ──
function AgencyList() {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Array<Record<string, unknown>>>([]);
  const [fetched, setFetched] = useState(false);

  async function fetchAgencies() {
    setLoading(true);
    const { data } = await supabase.from("agencies_directory").select("*").order("created_at", { ascending: false });
    setList(data || []); setLoading(false); setFetched(true);
  }

  if (!fetched) return (
    <div style={{ textAlign: "center", paddingTop: 80 }}>
      <p style={{ color: "#555", fontSize: 15, marginBottom: 20 }}>Click below to load agencies from the database.</p>
      <button onClick={fetchAgencies} style={{ background: "#1D9E75", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, cursor: "pointer" }}>Load agencies</button>
    </div>
  );

  if (loading) return <div style={{ color: "#555", textAlign: "center", paddingTop: 80 }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>All agencies</h1>
          <p style={{ color: "#555", fontSize: 14 }}>{list.length} agencies in database</p>
        </div>
        <button onClick={fetchAgencies} style={{ background: "transparent", color: "#1D9E75", border: "1px solid #1D9E75", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>Refresh</button>
      </div>
      {list.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: 60 }}>
          <p style={{ fontSize: 36, marginBottom: 12 }}>🏕️</p>
          <p style={{ color: "#fff", fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No agencies yet</p>
          <p style={{ color: "#555", fontSize: 14 }}>Add your first agency using the form.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {list.map((agency) => (
            <div key={String(agency.id)} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 14, padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "#0F2A1E", display: "flex", alignItems: "center", justifyContent: "center", color: "#1D9E75", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                  {String(agency.name || "?").charAt(0)}
                </div>
                <div>
                  <p style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: "0 0 3px" }}>{String(agency.name)}</p>
                  <p style={{ color: "#555", fontSize: 12, margin: 0 }}>📍 {String(agency.location)}, {String(agency.state)} · {String(agency.email)}</p>
                  {Array.isArray(agency.activities) && (
                    <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                      {(agency.activities as string[]).map((a) => (
                        <span key={a} style={{ background: "#0F2A1E", color: "#1D9E75", fontSize: 10, padding: "2px 8px", borderRadius: 6 }}>{a}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500, background: agency.verified ? "#0F2A1E" : "#1a1a1a", color: agency.verified ? "#1D9E75" : "#555" }}>
                {agency.verified ? "✓ Verified" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Trek List ──
function TrekList() {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Array<Record<string, unknown>>>([]);
  const [fetched, setFetched] = useState(false);

  async function fetchTreks() {
    setLoading(true);
    const { data } = await supabase.from("treks_directory").select("*").order("created_at", { ascending: false });
    setList(data || []); setLoading(false); setFetched(true);
  }

  if (!fetched) return (
    <div style={{ textAlign: "center", paddingTop: 80 }}>
      <p style={{ color: "#555", fontSize: 15, marginBottom: 20 }}>Click below to load treks from the database.</p>
      <button onClick={fetchTreks} style={{ background: "#1D9E75", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, cursor: "pointer" }}>Load treks</button>
    </div>
  );

  if (loading) return <div style={{ color: "#555", textAlign: "center", paddingTop: 80 }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>All treks</h1>
          <p style={{ color: "#555", fontSize: 14 }}>{list.length} treks in database</p>
        </div>
        <button onClick={fetchTreks} style={{ background: "transparent", color: "#1D9E75", border: "1px solid #1D9E75", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>Refresh</button>
      </div>
      {list.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: 60 }}>
          <p style={{ fontSize: 36, marginBottom: 12 }}>🥾</p>
          <p style={{ color: "#fff", fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No treks yet</p>
          <p style={{ color: "#555", fontSize: 14 }}>Add your first trek using the form.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {list.map((trek) => (
            <div key={String(trek.id)} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 14, padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "#111", border: "1px solid #222", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                  {activityEmoji[String(trek.activity_type)] || "🏔️"}
                </div>
                <div>
                  <p style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: "0 0 3px" }}>{String(trek.title)}</p>
                  <p style={{ color: "#555", fontSize: 12, margin: 0 }}>
                    📍 {String(trek.destination)}, {String(trek.state)} · ₹{Number(trek.price).toLocaleString("en-IN")} · {String(trek.difficulty)}
                  </p>
                  <p style={{ color: "#444", fontSize: 11, margin: "3px 0 0" }}>Agency: {String(trek.agency_slug)}</p>
                </div>
              </div>
              <span style={{ background: "#0F2A1E", color: "#1D9E75", fontSize: 11, padding: "4px 10px", borderRadius: 20 }}>
                {String(trek.activity_type)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Incomplete Onboardings ──
const difficultyLevels = [
  { label: "Easy", value: "easy" }, { label: "Moderate", value: "moderate" },
  { label: "Hard", value: "hard" }, { label: "Extreme", value: "extreme" },
];
const seasonOptions = ["Spring (Mar-May)", "Summer (Jun-Aug)", "Autumn (Sep-Nov)", "Winter (Dec-Feb)", "Year-round"];

function IncompleteOnboardings() {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Array<Record<string, unknown>>>([]);
  const [fetched, setFetched] = useState(false);
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const [fillingStep, setFillingStep] = useState<2 | 3>(2);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState<Set<string>>(new Set());

  async function sendReminder(agency: Record<string, unknown>) {
    const agencyEmail = String(agency.email);
    setSendingEmail(agencyEmail);
    setError("");
    try {
      const res = await fetch("/api/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: agencyEmail,
          agencyName: String(agency.name || ""),
          registrationId: String(agency.registration_id || ""),
          onboardingStep: Number(agency.onboarding_step) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError("Email failed: " + (data.error || "Unknown error"));
      } else {
        setEmailSent(prev => new Set(prev).add(agencyEmail));
        setSuccess(`Reminder sent to ${agencyEmail}`);
      }
    } catch {
      setError("Failed to send email. Check your Resend API key.");
    } finally {
      setSendingEmail(null);
    }
  }

  // Page 2 fields
  const [trekName, setTrekName] = useState("");
  const [trekArea, setTrekArea] = useState("");
  const [trekAltitude, setTrekAltitude] = useState("");
  const [trekDuration, setTrekDuration] = useState("");
  const [trekDescription, setTrekDescription] = useState("");
  const [trekPhotos, setTrekPhotos] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [pastTrekCount, setPastTrekCount] = useState("");
  const [pastTrekPhotos, setPastTrekPhotos] = useState("");
  const [trekInclusions, setTrekInclusions] = useState("");
  const [trekExclusions, setTrekExclusions] = useState("");
  const [googleReviewsLink, setGoogleReviewsLink] = useState("");

  // Page 3 fields
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
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);

  async function fetchIncomplete() {
    setLoading(true);
    const { data } = await supabase
      .from("agencies_directory")
      .select("*")
      .eq("onboarding_complete", false)
      .order("created_at", { ascending: false });
    setList(data || []);
    setLoading(false);
    setFetched(true);
  }

  function selectAgency(agency: Record<string, unknown>) {
    setSelected(agency);
    const step = Number(agency.onboarding_step) || 0;
    setFillingStep(step >= 2 ? 3 : 2);
    setError("");
    setSuccess("");
  }

  async function savePage2() {
    setError("");
    if (!trekName.trim()) { setError("Trek name is required."); return; }
    if (!trekDescription.trim()) { setError("Trek description is required."); return; }
    if (!itinerary.trim()) { setError("Itinerary is required."); return; }

    setSaving(true);
    const regId = String(selected?.registration_id || "");
    const agencyEmail = String(selected?.email || "");

    const { error: trekError } = await supabase.from("agency_treks").upsert([{
      agency_email: agencyEmail,
      registration_id: regId,
      trek_name: trekName.trim(),
      trek_slug: slugify(trekName),
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

    if (trekError) { setError("Save failed: " + trekError.message); setSaving(false); return; }

    await supabase.from("agencies_directory")
      .update({ onboarding_step: 2 })
      .eq("email", agencyEmail);

    setSaving(false);
    setFillingStep(3);
    setSuccess("Page 2 saved! Now fill Page 3.");
  }

  async function savePage3() {
    setError("");
    if (!pricePerPerson.trim()) { setError("Price per person is required."); return; }
    if (!difficulty) { setError("Please select difficulty."); return; }
    if (selectedSeasons.length === 0) { setError("Please select at least one season."); return; }

    setSaving(true);
    const regId = String(selected?.registration_id || "");
    const agencyEmail = String(selected?.email || "");

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
        season: selectedSeasons,
        onboarding_step: 3,
      })
      .eq("registration_id", regId);

    if (trekError) { setError("Save failed: " + trekError.message); setSaving(false); return; }

    await supabase.from("agencies_directory")
      .update({ onboarding_step: 3, onboarding_complete: true })
      .eq("email", agencyEmail);

    setSaving(false);
    setSuccess("Onboarding completed for " + String(selected?.name || selected?.email) + "!");
    setSelected(null);
    fetchIncomplete();
  }

  if (!fetched) return (
    <div style={{ textAlign: "center", paddingTop: 80 }}>
      <p style={{ color: "#555", fontSize: 15, marginBottom: 20 }}>Load agencies with incomplete registration.</p>
      <button onClick={fetchIncomplete} style={{ background: "#1D9E75", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, cursor: "pointer" }}>Load incomplete onboardings</button>
    </div>
  );

  if (loading) return <div style={{ color: "#555", textAlign: "center", paddingTop: 80 }}>Loading...</div>;

  // Filling form for a selected agency
  if (selected) {
    return (
      <div style={{ maxWidth: 720 }}>
        <button type="button" onClick={() => { setSelected(null); setSuccess(""); setError(""); }}
          style={{ background: "none", border: "none", color: "#555", fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 20 }}>
          ← Back to list
        </button>

        <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 14, padding: "18px 20px", marginBottom: 28 }}>
          <p style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: "0 0 4px" }}>
            Completing onboarding for: <span style={{ color: "#1D9E75" }}>{String(selected.name || selected.email)}</span>
          </p>
          <p style={{ color: "#555", fontSize: 12, margin: 0 }}>
            Reg ID: {String(selected.registration_id || "N/A")} · Email: {String(selected.email)} · Step: {String(selected.onboarding_step || 0)}/3
          </p>
        </div>

        {success && <Banner type="success" message={success} />}
        {error && <Banner type="error" message={error} />}

        {fillingStep === 2 && (
          <>
            <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Page 2 — Trek Details</h2>
            <FormSection title="Trek information">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="Trek name" required><input value={trekName} onChange={e => setTrekName(e.target.value)} placeholder="e.g. Hampta Pass Trek" style={inputStyle} /></Field>
                <Field label="Area / Region"><input value={trekArea} onChange={e => setTrekArea(e.target.value)} placeholder="e.g. Kullu-Manali" style={inputStyle} /></Field>
                <Field label="Max altitude"><input value={trekAltitude} onChange={e => setTrekAltitude(e.target.value)} placeholder="e.g. 14,100 ft" style={inputStyle} /></Field>
                <Field label="Duration"><input value={trekDuration} onChange={e => setTrekDuration(e.target.value)} placeholder="e.g. 5 Days / 4 Nights" style={inputStyle} /></Field>
              </div>
              <Field label="Trek description" required>
                <textarea value={trekDescription} onChange={e => setTrekDescription(e.target.value)} placeholder="Describe the trek..." rows={4} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
              </Field>
            </FormSection>
            <FormSection title="Photos & Itinerary">
              <Field label="Trek photo URLs (one per line)">
                <textarea value={trekPhotos} onChange={e => setTrekPhotos(e.target.value)} rows={3} placeholder="One URL per line" style={{ ...inputStyle, resize: "vertical" }} />
              </Field>
              <Field label="Day-wise itinerary" required>
                <textarea value={itinerary} onChange={e => setItinerary(e.target.value)} rows={6} placeholder="Day 1: ...\nDay 2: ..." style={{ ...inputStyle, resize: "vertical", lineHeight: 1.8 }} />
              </Field>
            </FormSection>
            <FormSection title="Past treks & Reviews">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="Past trek completions"><input value={pastTrekCount} onChange={e => setPastTrekCount(e.target.value)} type="number" placeholder="e.g. 45" style={inputStyle} /></Field>
                <Field label="Google Reviews link"><input value={googleReviewsLink} onChange={e => setGoogleReviewsLink(e.target.value)} placeholder="https://maps.google.com/..." style={inputStyle} /></Field>
              </div>
              <Field label="Past trek photo URLs (one per line)">
                <textarea value={pastTrekPhotos} onChange={e => setPastTrekPhotos(e.target.value)} rows={2} placeholder="URLs" style={{ ...inputStyle, resize: "vertical" }} />
              </Field>
            </FormSection>
            <FormSection title="Inclusions / Exclusions">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="What's included (one per line)">
                  <textarea value={trekInclusions} onChange={e => setTrekInclusions(e.target.value)} rows={4} placeholder="Meals\nCamping gear\nGuide" style={{ ...inputStyle, resize: "vertical" }} />
                </Field>
                <Field label="What's excluded (one per line)">
                  <textarea value={trekExclusions} onChange={e => setTrekExclusions(e.target.value)} rows={4} placeholder="Personal insurance\nTransport" style={{ ...inputStyle, resize: "vertical" }} />
                </Field>
              </div>
            </FormSection>
            <button type="button" onClick={savePage2} disabled={saving} style={{ background: "#1D9E75", color: "#fff", border: "none", borderRadius: 10, padding: "13px 28px", fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving..." : "Save Page 2 & Continue →"}
            </button>
          </>
        )}

        {fillingStep === 3 && (
          <>
            <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Page 3 — Pricing & Logistics</h2>
            <FormSection title="Pricing">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="Price per person (₹)" required><input value={pricePerPerson} onChange={e => setPricePerPerson(e.target.value)} type="number" placeholder="e.g. 8500" style={inputStyle} /></Field>
                <Field label="Discount %"><input value={discountPercent} onChange={e => setDiscountPercent(e.target.value)} type="number" placeholder="e.g. 10" min="0" max="100" style={inputStyle} /></Field>
              </div>
              <Field label="Discount note"><input value={discountNote} onChange={e => setDiscountNote(e.target.value)} placeholder="e.g. Early bird 10% off" style={inputStyle} /></Field>
            </FormSection>
            <FormSection title="Inclusions">
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#ccc", fontSize: 14, cursor: "pointer" }}>
                  <input type="checkbox" checked={includesStay} onChange={e => setIncludesStay(e.target.checked)} style={{ accentColor: "#1D9E75" }} /> Stay
                </label>
                {includesStay && (
                  <div style={{ display: "flex", gap: 8, marginLeft: 26 }}>
                    {["Hotel", "Camp/Tent", "Homestay", "Mixed"].map(t => (
                      <button key={t} type="button" onClick={() => setStayType(t)} style={{
                        padding: "5px 12px", borderRadius: 16, fontSize: 11, cursor: "pointer",
                        background: stayType === t ? "#0F2A1E" : "#111", border: `1px solid ${stayType === t ? "#1D9E75" : "#222"}`, color: stayType === t ? "#1D9E75" : "#888",
                      }}>{t}</button>
                    ))}
                  </div>
                )}
                <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#ccc", fontSize: 14, cursor: "pointer" }}>
                  <input type="checkbox" checked={includesFood} onChange={e => setIncludesFood(e.target.checked)} style={{ accentColor: "#1D9E75" }} /> Food
                </label>
                {includesFood && (
                  <div style={{ display: "flex", gap: 8, marginLeft: 26 }}>
                    {["Veg only", "Non-veg only", "Both"].map(t => (
                      <button key={t} type="button" onClick={() => setFoodType(t)} style={{
                        padding: "5px 12px", borderRadius: 16, fontSize: 11, cursor: "pointer",
                        background: foodType === t ? "#0F2A1E" : "#111", border: `1px solid ${foodType === t ? "#1D9E75" : "#222"}`, color: foodType === t ? "#1D9E75" : "#888",
                      }}>{t}</button>
                    ))}
                  </div>
                )}
                <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#ccc", fontSize: 14, cursor: "pointer" }}>
                  <input type="checkbox" checked={includesGuide} onChange={e => setIncludesGuide(e.target.checked)} style={{ accentColor: "#1D9E75" }} /> Certified Guide
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#ccc", fontSize: 14, cursor: "pointer" }}>
                  <input type="checkbox" checked={includesPermits} onChange={e => setIncludesPermits(e.target.checked)} style={{ accentColor: "#1D9E75" }} /> Permits & Entry Fees
                </label>
              </div>
            </FormSection>
            <FormSection title="Exclusions">
              <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#ccc", fontSize: 14, cursor: "pointer" }}>
                <input type="checkbox" checked={excludesTransport} onChange={e => setExcludesTransport(e.target.checked)} style={{ accentColor: "#EF4444" }} /> Transport not included
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#ccc", fontSize: 14, cursor: "pointer" }}>
                <input type="checkbox" checked={excludesPersonal} onChange={e => setExcludesPersonal(e.target.checked)} style={{ accentColor: "#EF4444" }} /> Personal expenses not included
              </label>
            </FormSection>
            <FormSection title="Difficulty & Availability">
              <Field label="Difficulty level" required>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {difficultyLevels.map(d => (
                    <button key={d.value} type="button" onClick={() => setDifficulty(d.value)} style={{
                      padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                      background: difficulty === d.value ? "#0F2A1E" : "#111", border: `1px solid ${difficulty === d.value ? "#1D9E75" : "#222"}`, color: difficulty === d.value ? "#1D9E75" : "#888",
                    }}>{d.label}</button>
                  ))}
                </div>
              </Field>
              <Field label="Batch dates (one per line)">
                <textarea value={batchDates} onChange={e => setBatchDates(e.target.value)} rows={4} placeholder="15 May 2026 - 20 May 2026" style={{ ...inputStyle, resize: "vertical" }} />
              </Field>
              <Field label="Season" required>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {seasonOptions.map(s => {
                    const sel = selectedSeasons.includes(s);
                    return (
                      <button key={s} type="button" onClick={() => setSelectedSeasons(prev => sel ? prev.filter(x => x !== s) : [...prev, s])} style={{
                        padding: "8px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                        background: sel ? "#0F2A1E" : "#111", border: `1px solid ${sel ? "#1D9E75" : "#222"}`, color: sel ? "#1D9E75" : "#888",
                      }}>{s}</button>
                    );
                  })}
                </div>
              </Field>
            </FormSection>
            <button type="button" onClick={savePage3} disabled={saving} style={{ background: "#1D9E75", color: "#fff", border: "none", borderRadius: 10, padding: "13px 28px", fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving..." : "Complete Registration ✓"}
            </button>
          </>
        )}
      </div>
    );
  }

  // List view
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Incomplete Onboardings</h1>
          <p style={{ color: "#555", fontSize: 14 }}>{list.length} agencies with incomplete registration</p>
        </div>
        <button onClick={fetchIncomplete} style={{ background: "transparent", color: "#1D9E75", border: "1px solid #1D9E75", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>Refresh</button>
      </div>
      {success && <Banner type="success" message={success} />}
      {list.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: 60 }}>
          <p style={{ fontSize: 36, marginBottom: 12 }}>✅</p>
          <p style={{ color: "#fff", fontSize: 16, fontWeight: 600, marginBottom: 6 }}>All caught up!</p>
          <p style={{ color: "#555", fontSize: 14 }}>No agencies with incomplete onboarding.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {list.map((agency) => {
            const step = Number(agency.onboarding_step) || 0;
            return (
              <div key={String(agency.id)} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 14, padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "#2A1F0F", display: "flex", alignItems: "center", justifyContent: "center", color: "#F59E0B", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                    {step}/3
                  </div>
                  <div>
                    <p style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: "0 0 3px" }}>{String(agency.name || "Unnamed agency")}</p>
                    <p style={{ color: "#555", fontSize: 12, margin: 0 }}>
                      {String(agency.email)} · Reg: {String(agency.registration_id || "N/A")}
                    </p>
                    <p style={{ color: "#444", fontSize: 11, margin: "3px 0 0" }}>
                      {step === 0 && "Signed up but hasn't filled any details"}
                      {step === 1 && "Filled agency details — needs trek info & pricing"}
                      {step === 2 && "Filled trek details — needs pricing & logistics"}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => sendReminder(agency)}
                    disabled={sendingEmail === String(agency.email) || emailSent.has(String(agency.email))}
                    style={{
                      background: emailSent.has(String(agency.email)) ? "#1a1a1a" : "transparent",
                      color: emailSent.has(String(agency.email)) ? "#555" : "#F59E0B",
                      border: `1px solid ${emailSent.has(String(agency.email)) ? "#222" : "#F59E0B"}`,
                      borderRadius: 8, padding: "8px 12px", fontSize: 11, fontWeight: 500,
                      cursor: emailSent.has(String(agency.email)) ? "default" : "pointer", whiteSpace: "nowrap",
                    }}
                  >
                    {sendingEmail === String(agency.email) ? "Sending..." : emailSent.has(String(agency.email)) ? "Sent ✓" : "Send Reminder"}
                  </button>
                  <button onClick={() => selectAgency(agency)} style={{
                    background: "#1D9E75", color: "#fff", border: "none", borderRadius: 8,
                    padding: "8px 12px", fontSize: 11, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap",
                  }}>
                    Complete →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main Admin Page ──
type Section = "add-agency" | "list-agencies" | "add-trek" | "list-treks" | "incomplete";

const sidebarItems: { id: Section; label: string; icon: string; group: string }[] = [
  { id: "add-agency", label: "Add agency", icon: "+", group: "Agencies" },
  { id: "list-agencies", label: "All agencies", icon: "≡", group: "Agencies" },
  { id: "incomplete", label: "Incomplete", icon: "⚠", group: "Agencies" },
  { id: "add-trek", label: "Add trek", icon: "+", group: "Treks" },
  { id: "list-treks", label: "All treks", icon: "≡", group: "Treks" },
];

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [gateReason, setGateReason] = useState<"none" | "user">("none");
  const [activeSection, setActiveSection] = useState<Section>("add-agency");

  useEffect(() => {
    const s = getSession();
    if (s?.role === "admin") {
      setUnlocked(true);
      setGateReason("none");
    } else {
      setUnlocked(false);
      setGateReason(s?.role === "user" ? "user" : "none");
    }
    setReady(true);
  }, []);

  if (!ready) {
    return <div style={{ background: "#0a0a0a", minHeight: "100vh" }} aria-hidden />;
  }
  if (!unlocked) return <AdminAccessGate reason={gateReason} onUnlock={() => setUnlocked(true)} />;

  const groups = ["Agencies", "Treks"];

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "sans-serif" }}>
      {/* Top bar */}
      <div style={{ background: "#0d0d0d", borderBottom: "1px solid #1a1a1a", padding: "0 28px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Image src="/WildRoute_PFP_Tilted.png" alt="WildRoute" width={30} height={30} style={{ borderRadius: "50%" }} />
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Wild<span style={{ color: "#1D9E75" }}>Route</span></span>
          <span style={{ color: "#333", fontSize: 16, margin: "0 4px" }}>/</span>
          <span style={{ color: "#666", fontSize: 14 }}>Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <button
            type="button"
            onClick={() => {
              clearSession();
              router.push("/login");
            }}
            style={{ background: "none", border: "none", color: "#888", fontSize: 13, cursor: "pointer", padding: 0 }}
          >
            Log out
          </button>
          <Link href="/" style={{ color: "#555", fontSize: 13, textDecoration: "none" }}>← Back to site</Link>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 58px)" }}>
        {/* Sidebar */}
        <aside style={{ width: 220, background: "#0d0d0d", borderRight: "1px solid #1a1a1a", padding: "24px 0", flexShrink: 0 }}>
          {groups.map((group) => (
            <div key={group} style={{ marginBottom: 8 }}>
              <p style={{ color: "#444", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", padding: "0 20px", marginBottom: 6 }}>{group.toUpperCase()}</p>
              {sidebarItems.filter((i) => i.group === group).map((item) => (
                <button key={item.id} onClick={() => setActiveSection(item.id)} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  width: "100%", padding: "10px 20px", border: "none", cursor: "pointer",
                  background: activeSection === item.id ? "#0F2A1E" : "transparent",
                  color: activeSection === item.id ? "#1D9E75" : "#666",
                  fontSize: 13, fontWeight: activeSection === item.id ? 600 : 400,
                  borderLeft: activeSection === item.id ? "2px solid #1D9E75" : "2px solid transparent",
                  textAlign: "left",
                }}>
                  <span style={{ fontSize: 15 }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
              <div style={{ height: 16 }} />
            </div>
          ))}
        </aside>

        {/* Content */}
        <main style={{ flex: 1, padding: "36px 40px", overflowY: "auto" }}>
          {activeSection === "add-agency" && <AddAgencyForm />}
          {activeSection === "list-agencies" && <AgencyList />}
          {activeSection === "incomplete" && <IncompleteOnboardings />}
          {activeSection === "add-trek" && <AddTrekForm />}
          {activeSection === "list-treks" && <TrekList />}
        </main>
      </div>
    </div>
  );
}
