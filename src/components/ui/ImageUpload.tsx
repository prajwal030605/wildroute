"use client";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth-session";

type Props = {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  label?: string;
};

export function SingleImageUpload({ value, onChange, placeholder = "Upload image", label }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please select an image file."); return; }
    if (file.size > 10 * 1024 * 1024) { setError("Image must be under 10MB."); return; }

    setUploading(true);
    setError("");

    const session = getSession();
    const folder = session?.email?.replace(/[@.]/g, "_") || "uploads";
    const ext = file.name.split(".").pop();
    const fileName = `${folder}/${placeholder.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("agency-images")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      setError("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("agency-images").getPublicUrl(fileName);
    onChange(data.publicUrl);
    setUploading(false);
  }

  return (
    <div>
      {label && <label style={{ color: "#1D9E75", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>{label}</label>}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        style={{
          border: "2px dashed #222", borderRadius: 10, padding: "20px 16px",
          cursor: "pointer", textAlign: "center", background: "#0d0d0d",
          transition: "border-color 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = "#1D9E75")}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "#222")}
      >
        {value ? (
          <div style={{ position: "relative" }}>
            <img src={value} alt="Uploaded" style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 8 }} />
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onChange(""); }}
              style={{
                position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.7)",
                border: "none", color: "#fff", borderRadius: "50%", width: 28, height: 28,
                cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >✕</button>
            <p style={{ color: "#555", fontSize: 11, marginTop: 8 }}>Click to replace</p>
          </div>
        ) : uploading ? (
          <div>
            <p style={{ color: "#1D9E75", fontSize: 14, margin: 0 }}>Uploading...</p>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: 28, margin: "0 0 8px" }}>📸</p>
            <p style={{ color: "#fff", fontSize: 13, fontWeight: 500, margin: "0 0 4px" }}>{placeholder}</p>
            <p style={{ color: "#444", fontSize: 11, margin: 0 }}>Click to browse or drag & drop · Max 10MB</p>
          </div>
        )}
      </div>
      {error && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 6 }}>{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
    </div>
  );
}

type MultiProps = {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  max?: number;
};

export function MultiImageUpload({ value, onChange, label, max = 6 }: MultiProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    if (!files.length) return;
    const remaining = max - value.length;
    if (remaining <= 0) { setError(`Maximum ${max} images allowed.`); return; }

    setUploading(true);
    setError("");

    const session = getSession();
    const folder = session?.email?.replace(/[@.]/g, "_") || "uploads";
    const uploaded: string[] = [];

    for (let i = 0; i < Math.min(files.length, remaining); i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 10 * 1024 * 1024) continue;

      const ext = file.name.split(".").pop();
      const fileName = `${folder}/photo-${Date.now()}-${i}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("agency-images")
        .upload(fileName, file, { upsert: true });

      if (!uploadError) {
        const { data } = supabase.storage.from("agency-images").getPublicUrl(fileName);
        uploaded.push(data.publicUrl);
      }
    }

    onChange([...value, ...uploaded]);
    setUploading(false);
  }

  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  return (
    <div>
      {label && <label style={{ color: "#1D9E75", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>{label}</label>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10, marginBottom: 10 }}>
        {value.map((url, idx) => (
          <div key={idx} style={{ position: "relative", borderRadius: 8, overflow: "hidden", aspectRatio: "1", background: "#111" }}>
            <img src={url} alt={`Photo ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <button
              type="button"
              onClick={() => remove(idx)}
              style={{
                position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.7)",
                border: "none", color: "#fff", borderRadius: "50%", width: 22, height: 22,
                cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >✕</button>
          </div>
        ))}

        {value.length < max && (
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
            style={{
              border: "2px dashed #222", borderRadius: 8, aspectRatio: "1",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              cursor: "pointer", background: "#0d0d0d", transition: "border-color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#1D9E75")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#222")}
          >
            {uploading ? (
              <p style={{ color: "#1D9E75", fontSize: 11, margin: 0 }}>Uploading...</p>
            ) : (
              <>
                <p style={{ fontSize: 20, margin: "0 0 4px" }}>+</p>
                <p style={{ color: "#555", fontSize: 10, margin: 0 }}>Add photo</p>
              </>
            )}
          </div>
        )}
      </div>

      <p style={{ color: "#444", fontSize: 11 }}>{value.length}/{max} photos · Click + to add more</p>
      {error && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: "none" }}
        onChange={e => { if (e.target.files) handleFiles(e.target.files); e.target.value = ""; }} />
    </div>
  );
}
