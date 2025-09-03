import { SiteNavbar } from "@/components/site-navbar"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"

export default function HomePage() {
  return (
    <main className="min-h-dvh" style={{ backgroundColor: "#F3F4F6", color: "#111827" }}>
      <SiteNavbar />
      <Hero />
      <Features />
      <footer
        className="mt-16"
        style={{
          borderTop: "1px solid rgba(17, 24, 39, 0.15)",
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm">
          © {new Date().getFullYear()} EcoStack. All rights reserved.
        </div>
      </footer>
    </main>
  )
}
