"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EnquiryForm({
  trekTitle,
  agencyEmail,
  agencyName,
}: {
  trekTitle?: string;
  agencyEmail?: string;
  agencyName?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [groupSize, setGroupSize] = useState("1");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) { setError("Name and email are required."); return; }
    setError(""); setSubmitting(true);

    const { error: sbError } = await supabase.from("enquiries").insert([{
      name,
      email,
      phone: phone || null,
      message: message || null,
      group_size: parseInt(groupSize),
      trek_title: trekTitle || null,
      agency_email: agencyEmail || null,
      agency_name: agencyName || null,
    }]);

    setSubmitting(false);
    if (sbError) {
      setError("Something went wrong. Please try again.");
    } else {
      setSubmitted(true);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#0a0a0a", border: "1px solid #222", borderRadius: 8,
    padding: "10px 12px", fontSize: 13, color: "#fff", outline: "none", boxSizing: "border-box",
  };

  if (submitted) {
    return (
      <div style={{ background: "#0F2A1E", border: "1px solid #1D9E75", borderRadius: 16, padding: 24, textAlign: "center" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#1D9E75", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10l4.5 4.5 7.5-9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Enquiry sent!</h3>
        <p style={{ color: "#5DCAA5", fontSize: 13 }}>
          {agencyName || "The agency"} will get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 16, padding: 22 }}>
      <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
        Send an enquiry
      </h3>
      {trekTitle && (
        <p style={{ color: "#555", fontSize: 12, marginBottom: 16 }}>About: {trekTitle}</p>
      )}

      {error && (
        <div style={{ background: "#2A0F0F", border: "1px solid #EF4444", borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}>
          <p style={{ color: "#EF4444", fontSize: 12, margin: 0 }}>⚠ {error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <label style={{ display: "block", color: "#666", fontSize: 11, marginBottom: 5 }}>Your name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rahul Sharma" style={inputStyle} />
        </div>
        <div>
          <label style={{ display: "block", color: "#666", fontSize: 11, marginBottom: 5 }}>Email *</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@email.com" style={inputStyle} />
        </div>
        <div>
          <label style={{ display: "block", color: "#666", fontSize: 11, marginBottom: 5 }}>Phone (optional)</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="+91 98765 43210" style={inputStyle} />
        </div>
        <div>
          <label style={{ display: "block", color: "#666", fontSize: 11, marginBottom: 5 }}>Group size</label>
          <select value={groupSize} onChange={(e) => setGroupSize(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
            {[1,2,3,4,5,6,7,8,9,10].map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? "person" : "people"}</option>
            ))}
            <option value="10+">10+ people</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", color: "#666", fontSize: 11, marginBottom: 5 }}>Message (optional)</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)}
            placeholder="Preferred dates, questions, special requirements..."
            rows={3} style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }} />
        </div>

        <button type="submit" disabled={submitting} style={{
          width: "100%", padding: "12px", background: "#1D9E75", color: "#fff",
          border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600,
          cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1, marginTop: 4,
        }}>
          {submitting ? "Sending..." : "Send enquiry →"}
        </button>
        <p style={{ color: "#333", fontSize: 11, textAlign: "center" }}>
          Free to enquire · No commitment
        </p>
      </form>
    </div>
  );
}
