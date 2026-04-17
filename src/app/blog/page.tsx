"use client";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { blogPosts } from "@/data/blogs";

const categoryColors: Record<string, { bg: string; color: string }> = {
  "Cost Guides":     { bg: "#1a2e1a", color: "#4ade80" },
  "Safety & Tips":   { bg: "#2e1a1a", color: "#f87171" },
  "Trek Guides":     { bg: "#1a1f2e", color: "#60a5fa" },
  "Activity Guides": { bg: "#2e2a1a", color: "#fbbf24" },
};

export default function BlogPage() {
  const featured = blogPosts[0];
  const rest = blogPosts.slice(1);

  return (
    <>
      <Navbar />
      <main style={{ background: "#0a0a0a", minHeight: "100vh", paddingTop: 64 }}>

        {/* Header */}
        <div style={{ background: "#0f0f0f", borderBottom: "1px solid #1a1a1a", padding: "60px 24px 48px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{
              display: "inline-block", background: "#1a2e1a", color: "#1D9E75",
              padding: "4px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600,
              marginBottom: 16, letterSpacing: "0.05em",
            }}>
              WILDROUTE BLOG
            </div>
            <h1 style={{ color: "#fff", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, margin: "0 0 16px", lineHeight: 1.15 }}>
              Trek smarter.<br /><span style={{ color: "#1D9E75" }}>Know before you go.</span>
            </h1>
            <p style={{ color: "#888", fontSize: 18, maxWidth: 560, margin: 0, lineHeight: 1.7 }}>
              Honest guides, cost breakdowns, safety tips, and everything else you need to plan your next Indian adventure.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 80px" }}>

          {/* Featured Post */}
          <div style={{ marginBottom: 56 }}>
            <p style={{ color: "#555", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 20 }}>FEATURED ARTICLE</p>
            <Link href={`/blog/${featured.slug}`} style={{ textDecoration: "none" }}>
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0,
                background: "#111", borderRadius: 16, overflow: "hidden",
                border: "1px solid #1e1e1e",
                transition: "border-color 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#1D9E75")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#1e1e1e")}
              >
                <div style={{ position: "relative", minHeight: 340 }}>
                  <Image
                    src={featured.coverImage}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                    priority
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to right, transparent 60%, #111 100%)",
                  }} />
                </div>
                <div style={{ padding: "40px 40px 40px 36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
                    <span style={{
                      background: categoryColors[featured.category]?.bg ?? "#1a1a1a",
                      color: categoryColors[featured.category]?.color ?? "#aaa",
                      padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                    }}>{featured.category}</span>
                    <span style={{ color: "#555", fontSize: 13 }}>{featured.readTime}</span>
                    <span style={{ color: "#555", fontSize: 13 }}>{featured.date}</span>
                  </div>
                  <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 700, margin: "0 0 16px", lineHeight: 1.3 }}>
                    {featured.title}
                  </h2>
                  <p style={{ color: "#888", fontSize: 15, lineHeight: 1.7, margin: "0 0 28px" }}>
                    {featured.excerpt}
                  </p>
                  <span style={{ color: "#1D9E75", fontSize: 14, fontWeight: 600 }}>
                    Read article →
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* All Other Posts */}
          <p style={{ color: "#555", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 24 }}>ALL ARTICLES</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {rest.map((post) => {
              const cat = categoryColors[post.category] ?? { bg: "#1a1a1a", color: "#aaa" };
              return (
                <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    background: "#111", borderRadius: 14, overflow: "hidden",
                    border: "1px solid #1e1e1e", height: "100%",
                    display: "flex", flexDirection: "column",
                    transition: "border-color 0.2s, transform 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#1D9E75"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e1e1e"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <div style={{ height: 200, overflow: "hidden", position: "relative" }}>
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center" }}>
                        <span style={{
                          background: cat.bg, color: cat.color,
                          padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                        }}>{post.category}</span>
                        <span style={{ color: "#555", fontSize: 12 }}>{post.readTime}</span>
                      </div>
                      <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 700, margin: "0 0 10px", lineHeight: 1.4 }}>
                        {post.title}
                      </h3>
                      <p style={{ color: "#777", fontSize: 14, lineHeight: 1.65, margin: "0 0 20px", flex: 1 }}>
                        {post.excerpt}
                      </p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: "#555", fontSize: 12 }}>{post.date}</span>
                        <span style={{ color: "#1D9E75", fontSize: 13, fontWeight: 600 }}>Read →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
