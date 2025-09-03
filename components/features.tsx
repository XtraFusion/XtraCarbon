import { FeatureCard } from "@/components/feature-card"
import { Leaf, ShieldCheck, Zap } from "lucide-react"

export function Features() {
  return (
    <section style={{ backgroundColor: "#F3F4F6" }}>
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-balance" style={{ color: "#111827" }}>
            Sustainability, trust, and innovation—built in.
          </h2>
          <p className="mt-3 leading-relaxed">
            Leverage green engineering principles, transparent tooling, and modern developer experience to deliver
            products that perform and preserve.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            accent="emerald"
            icon={<Leaf className="h-5 w-5" aria-hidden="true" />}
            title="Carbon-aware defaults"
            description="Optimize builds and workloads with eco-friendly recommendations tuned for real-world impact."
          />
          <FeatureCard
            accent="blue"
            icon={<ShieldCheck className="h-5 w-5" aria-hidden="true" />}
            title="Trusted by design"
            description="Secure foundations and transparent metrics you can trust during hackathons or production."
          />
          <FeatureCard
            accent="amber"
            icon={<Zap className="h-5 w-5" aria-hidden="true" />}
            title="Innovation at speed"
            description="Spin up features quickly with best-practice templates and a frictionless developer workflow."
          />
        </div>
      </div>
    </section>
  )
}
