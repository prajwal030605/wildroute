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
      <main style={{ background: "var(--wr-bg)", minHeight: "100vh", paddingTop: 64, transition: "background 0.2s" }}>

        {/* Header */}
        <div style={{ background: "var(--wr-bg-alt)", borderBottom: "1px solid var(--wr-border)", padding: "60px 24px 48px", transition: "background 0.2s, border-color 0.2s" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{
              display: "inline-block", background: "var(--wr-green-bg)", color: "var(--wr-green)",
              padding: "4px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600,
              marginBottom: 16, letterSpacing: "0.05em",
            }}>
              WILDROUTE BLOG
            </div>
            <h1 style={{ color: "var(--wr-text)", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, margin: "0 0 16px", lineHeight: 1.15 }}>
              Trek smarter.<br /><span style={{ color: "var(--wr-green)" }}>Know before you go.</span>
            </h1>
            <p style={{ color: "var(--wr-text-muted)", fontSize: 18, maxWidth: 560, margin: 0, lineHeight: 1.7 }}>
              Honest guides, cost breakdowns, safety tips, and everything else you need to plan your next Indian adventure.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 80px" }}>

          {/* Featured Post */}
          <div style={{ marginBottom: 56 }}>
            <p style={{ color: "var(--wr-text-faint)", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 20 }}>FEATURED ARTICLE</p>
            <Link href={`/blog/${featured.slug}`} style={{ textDecoration: "none" }}>
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0,
                background: "var(--wr-card)", borderRadius: 16, overflow: "hidden",
                border: "1px solid var(--wr-border)",
                transition: "border-color 0.2s, background 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--wr-green)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--wr-border)")}
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
                    background: "linear-gradient(to right, transparent 60%, var(--wr-card) 100%)",
                  }} />
                </div>
                <div style={{ padding: "40px 40px 40px 36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{
                      background: categoryColors[featured.category]?.bg ?? "var(--wr-card-hover)",
                      color: categoryColors[featured.category]?.color ?? "var(--wr-text-muted)",
                      padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                    }}>{featured.category}</span>
                    <span style={{ color: "var(--wr-text-faint)", fontSize: 13 }}>{featured.readTime}</span>
                    <span style={{ color: "var(--wr-text-faint)", fontSize: 13 }}>{featured.date}</span>
                  </div>
                  <h2 style={{ color: "var(--wr-text)", fontSize: 26, fontWeight: 700, margin: "0 0 16px", lineHeight: 1.3 }}>
                    {featured.title}
                  </h2>
                  <p style={{ color: "var(--wr-text-muted)", fontSize: 15, lineHeight: 1.7, margin: "0 0 28px" }}>
                    {featured.excerpt}
                  </p>
                  <span style={{ color: "var(--wr-green)", fontSize: 14, fontWeight: 600 }}>
                    Read article →
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* All Other Posts */}
          <p style={{ color: "var(--wr-text-faint)", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 24 }}>ALL ARTICLES</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {rest.map((post) => {
              const cat = categoryColors[post.category] ?? { bg: "var(--wr-card-hover)", color: "var(--wr-text-muted)" };
              return (
                <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    background: "var(--wr-card)", borderRadius: 14, overflow: "hidden",
                    border: "1px solid var(--wr-border)", height: "100%",
                    display: "flex", flexDirection: "column",
                    transition: "border-color 0.2s, transform 0.2s, background 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--wr-green)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--wr-border)"; e.currentTarget.style.transform = "translateY(0)"; }}
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
                        <span style={{ color: "var(--wr-text-faint)", fontSize: 12 }}>{post.readTime}</span>
                      </div>
                      <h3 style={{ color: "var(--wr-text)", fontSize: 17, fontWeight: 700, margin: "0 0 10px", lineHeight: 1.4 }}>
                        {post.title}
                      </h3>
                      <p style={{ color: "var(--wr-text-muted)", fontSize: 14, lineHeight: 1.65, margin: "0 0 20px", flex: 1 }}>
                        {post.excerpt}
                      </p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: "var(--wr-text-faint)", fontSize: 12 }}>{post.date}</span>
                        <span style={{ color: "var(--wr-green)", fontSize: 13, fontWeight: 600 }}>Read →</span>
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
