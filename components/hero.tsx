import Link from "next/link"

export function Hero() {
  return (
    <section style={{ backgroundColor: "#F3F4F6" }}>
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
            style={{ backgroundColor: "rgba(250, 204, 21, 0.2)", color: "#111827" }}
          >
            <span className="h-2 w-2 rounded-full" aria-hidden="true" style={{ backgroundColor: "#FACC15" }} />
            Sustainability-first platform
          </div>
          <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight md:text-5xl" style={{ color: "#111827" }}>
            Build eco‑friendly apps, fast.
          </h1>
          <p className="mt-4 text-pretty leading-relaxed">
            Ship hackathon-ready projects with an infrastructure that respects the planet. EcoStack combines green
            hosting insights, efficient tooling, and best practices to minimize your carbon footprint without
            sacrificing speed.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center rounded-md px-4 py-2.5 text-sm font-medium focus:outline-none"
              style={{ backgroundColor: "#059669", color: "#F3F4F6" }}
            >
              Get started
            </Link>
            <Link
              href="#about"
              className="inline-flex items-center rounded-md border px-4 py-2.5 text-sm font-medium focus:outline-none"
              style={{
                borderColor: "#1E3A8A",
                color: "#1E3A8A",
              }}
            >
              Learn more
            </Link>
          </div>

          <ul className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" aria-hidden="true" style={{ backgroundColor: "#059669" }} />
              Carbon-aware recommendations
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" aria-hidden="true" style={{ backgroundColor: "#1E3A8A" }} />
              Production-grade DX
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" aria-hidden="true" style={{ backgroundColor: "#FACC15" }} />
              Real-time impact metrics
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" aria-hidden="true" style={{ backgroundColor: "#111827" }} />
              Accessible by default
            </li>
          </ul>
        </div>

        <div className="relative">
          <div
            className="aspect-[4/3] w-full overflow-hidden rounded-xl shadow-sm"
            style={{
              border: "1px solid rgba(17, 24, 39, 0.15)",
              backgroundColor: "#F3F4F6",
            }}
          >
            <img
              src="/images/eco-hero.jpg"
              alt="Eco impact dashboard preview with clean UI"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="pointer-events-none absolute -bottom-4 -right-4 hidden md:block">
            <div
              className="rounded-lg px-3 py-2 shadow-sm"
              style={{
                border: "1px solid rgba(17, 24, 39, 0.15)",
                backgroundColor: "#F3F4F6",
                color: "#111827",
              }}
            >
              <span className="text-xs">Powered by efficient defaults</span>
            </div>
          </div>
        </div>
      </div>
      <div id="about" className="sr-only">
        About section anchor
      </div>
    </section>
  )
}
