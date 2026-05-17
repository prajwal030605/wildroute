"use client";
import { useState } from "react";

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

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email,
          phone: phone || null,
          message: message || null,
          groupSize,
          trekTitle: trekTitle || null,
          agencyEmail: agencyEmail || null,
          agencyName: agencyName || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--wr-bg)",
    border: "1px solid var(--wr-border-strong)",
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: 13,
    color: "var(--wr-text)",
    outline: "none",
    boxSizing: "border-box",
  };

  if (submitted) {
    return (
      <div style={{
        background: "var(--wr-green-bg)",
        border: "1px solid var(--wr-green)",
        borderRadius: 16, padding: 24, textAlign: "center",
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%", background: "var(--wr-green)",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px",
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10l4.5 4.5 7.5-9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 style={{ color: "var(--wr-text)", fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Enquiry received!</h3>
        <p style={{ color: "var(--wr-text-muted)", fontSize: 13, marginBottom: 4 }}>
          Our team will review and connect you with {agencyName || "the agency"}.
        </p>
        <p style={{ color: "var(--wr-green)", fontSize: 13, fontWeight: 500 }}>
          ✓ Expect a response within 24 hours
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: "var(--wr-card)",
      border: "1px solid var(--wr-border)",
      borderRadius: 16, padding: 22,
      transition: "background 0.2s, border-color 0.2s",
    }}>
      <h3 style={{ color: "var(--wr-text)", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
        Send an enquiry
      </h3>
      {trekTitle && (
        <p style={{ color: "var(--wr-text-faint)", fontSize: 12, marginBottom: 16 }}>About: {trekTitle}</p>
      )}

      {error && (
        <div style={{ background: "#2A0F0F", border: "1px solid #EF4444", borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}>
          <p style={{ color: "#EF4444", fontSize: 12, margin: 0 }}>⚠ {error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <label style={{ display: "block", color: "var(--wr-text-muted)", fontSize: 11, marginBottom: 5 }}>Your name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rahul Sharma" style={inputStyle} />
        </div>
        <div>
          <label style={{ display: "block", color: "var(--wr-text-muted)", fontSize: 11, marginBottom: 5 }}>Email *</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@email.com" style={inputStyle} />
        </div>
        <div>
          <label style={{ display: "block", color: "var(--wr-text-muted)", fontSize: 11, marginBottom: 5 }}>Phone (optional)</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="+91 98765 43210" style={inputStyle} />
        </div>
        <div>
          <label style={{ display: "block", color: "var(--wr-text-muted)", fontSize: 11, marginBottom: 5 }}>Group size</label>
          <select value={groupSize} onChange={(e) => setGroupSize(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
            {[1,2,3,4,5,6,7,8,9,10].map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? "person" : "people"}</option>
            ))}
            <option value="10+">10+ people</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", color: "var(--wr-text-muted)", fontSize: 11, marginBottom: 5 }}>Message (optional)</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)}
            placeholder="Preferred dates, questions, special requirements..."
            rows={3} style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }} />
        </div>

        <button type="submit" disabled={submitting} style={{
          width: "100%", padding: "12px", background: "var(--wr-green)", color: "#fff",
          border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600,
          cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1, marginTop: 4,
        }}>
          {submitting ? "Sending..." : "Send enquiry →"}
        </button>
        <p style={{ color: "var(--wr-text-faint)", fontSize: 11, textAlign: "center" }}>
          Free to enquire · WildRoute reviews before connecting you
        </p>
      </form>
    </div>
  );
}
