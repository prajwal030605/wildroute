import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { blogPosts } from "@/data/blogs";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

const categoryColors: Record<string, { bg: string; color: string }> = {
  "Cost Guides":     { bg: "#1a2e1a", color: "#4ade80" },
  "Safety & Tips":   { bg: "#2e1a1a", color: "#f87171" },
  "Trek Guides":     { bg: "#1a1f2e", color: "#60a5fa" },
  "Activity Guides": { bg: "#2e2a1a", color: "#fbbf24" },
};

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} style={{
          color: "#fff", fontSize: 24, fontWeight: 700,
          margin: "40px 0 16px", borderLeft: "3px solid #1D9E75", paddingLeft: 16,
        }}>
          {line.replace("## ", "")}
        </h2>
      );
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(
        <p key={i} style={{ color: "#1D9E75", fontWeight: 700, fontSize: 16, margin: "20px 0 6px" }}>
          {line.replace(/\*\*/g, "")}
        </p>
      );
    } else if (line.startsWith("![")) {
      // Image: ![caption](url)
      const match = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (match) {
        const [, caption, url] = match;
        elements.push(
          <div key={i} style={{ margin: "36px 0" }}>
            <img
              src={url}
              alt={caption}
              style={{
                width: "100%", borderRadius: 14, display: "block",
                objectFit: "cover", maxHeight: 420,
              }}
            />
            {caption && (
              <p style={{ color: "#555", fontSize: 13, textAlign: "center", marginTop: 10, fontStyle: "italic" }}>
                {caption}
              </p>
            )}
          </div>
        );
      }
    } else if (line.startsWith("| ")) {
      // Table
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("| ")) {
        tableLines.push(lines[i]);
        i++;
      }
      const headers = tableLines[0].split("|").filter(Boolean).map(s => s.trim());
      const rows = tableLines.slice(2).map(row => row.split("|").filter(Boolean).map(s => s.trim()));
      elements.push(
        <div key={`table-${i}`} style={{ overflowX: "auto", margin: "24px 0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#1a1a1a" }}>
                {headers.map((h, j) => (
                  <th key={j} style={{ padding: "12px 16px", textAlign: "left", color: "#1D9E75", fontWeight: 600, borderBottom: "1px solid #2a2a2a" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 === 0 ? "#111" : "#0f0f0f" }}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{ padding: "12px 16px", color: cell.startsWith("**") ? "#fff" : "#aaa", borderBottom: "1px solid #1a1a1a", fontWeight: cell.startsWith("**") ? 700 : 400 }}>
                      {cell.replace(/\*\*/g, "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    } else if (line.trim() === "") {
      // skip blank lines
    } else {
      elements.push(
        <p key={i} style={{ color: "#b0b8c4", fontSize: 16, lineHeight: 1.85, margin: "0 0 18px" }}>
          {line}
        </p>
      );
    }
    i++;
  }

  return elements;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return notFound();

  const cat = categoryColors[post.category] ?? { bg: "#1a1a1a", color: "#aaa" };
  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <Navbar />
      <main style={{ background: "#0a0a0a", minHeight: "100vh", paddingTop: 64 }}>

        {/* Hero */}
        <div style={{ position: "relative", height: 420, overflow: "hidden" }}>
          <img src={post.coverImage} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(10,10,10,0.95) 100%)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 24px 48px", maxWidth: 820, margin: "0 auto" }}>
            <div style={{ maxWidth: 820, margin: "0 auto" }}>
              <Link href="/blog" style={{ color: "#888", fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
                ← Back to Blog
              </Link>
              <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ background: cat.bg, color: cat.color, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                  {post.category}
                </span>
                <span style={{ color: "#666", fontSize: 13 }}>{post.readTime}</span>
                <span style={{ color: "#666", fontSize: 13 }}>{post.date}</span>
              </div>
              <h1 style={{ color: "#fff", fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 800, margin: 0, lineHeight: 1.25 }}>
                {post.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 80px", display: "grid", gridTemplateColumns: "1fr 300px", gap: 48 }}>

          {/* Article */}
          <article>
            <p style={{ color: "#888", fontSize: 17, lineHeight: 1.8, margin: "0 0 32px", borderLeft: "3px solid #1D9E75", paddingLeft: 20, fontStyle: "italic" }}>
              {post.excerpt}
            </p>
            <div>{renderContent(post.content)}</div>

            {/* CTA Banner */}
            <div style={{
              background: "linear-gradient(135deg, #0d2b1e, #0a1a12)",
              border: "1px solid #1D9E75", borderRadius: 16,
              padding: "32px", marginTop: 48, textAlign: "center",
            }}>
              <h3 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: "0 0 10px" }}>
                Ready to book your next adventure?
              </h3>
              <p style={{ color: "#888", fontSize: 15, margin: "0 0 24px" }}>
                WildRoute verifies every agency before they go live — so you book with confidence.
              </p>
              <Link href="/#waitlist" style={{
                background: "#1D9E75", color: "#fff", padding: "12px 28px",
                borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: 15,
              }}>
                Join the Waitlist — It's Free
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside style={{ position: "sticky", top: 84, height: "fit-content" }}>
            {/* Share */}
            <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 14, padding: 24, marginBottom: 24 }}>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 15, margin: "0 0 16px" }}>Share this article</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Share on WhatsApp", color: "#25D366", bg: "#1a2e1a" },
                  { label: "Share on Twitter/X", color: "#1DA1F2", bg: "#1a1f2e" },
                  { label: "Copy link", color: "#aaa", bg: "#1a1a1a" },
                ].map(({ label, color, bg }) => (
                  <button key={label} style={{
                    background: bg, color, border: "none",
                    padding: "10px 16px", borderRadius: 8, cursor: "pointer",
                    fontSize: 13, fontWeight: 600, textAlign: "left",
                  }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Related Posts */}
            <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 14, padding: 24 }}>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 15, margin: "0 0 16px" }}>More articles</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {related.map((r) => (
                  <Link key={r.slug} href={`/blog/${r.slug}`} style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <img src={r.coverImage} alt={r.title} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                      <div>
                        <p style={{ color: "#ddd", fontSize: 13, fontWeight: 600, margin: "0 0 4px", lineHeight: 1.4 }}>{r.title}</p>
                        <p style={{ color: "#555", fontSize: 12, margin: 0 }}>{r.readTime}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
