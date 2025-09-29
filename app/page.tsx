 
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { saveUserToDB } from "./action/saveUser"
export default function HomePage() {
  saveUserToDB();
  return (
    <main className="min-h-dvh" style={{ backgroundColor: "#F3F4F6", color: "#111827" }}>
 
      <Hero />
      <Features />
      <footer
        className="mt-16"
        style={{
          borderTop: "1px solid rgba(17, 24, 39, 0.15)",
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm">
          © {new Date().getFullYear()} XtraCarbon. All rights reserved.
        </div>
      </footer>
    </main>
  )
}
