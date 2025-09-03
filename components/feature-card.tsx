import type { ReactNode } from "react"

type FeatureCardProps = {
  icon: ReactNode
  title: string
  description: string
  accent?: "emerald" | "blue" | "amber"
}

const accents: Record<NonNullable<FeatureCardProps["accent"]>, { bg: string; fg: string }> = {
  emerald: { bg: "#059669", fg: "#F3F4F6" },
  blue: { bg: "#1E3A8A", fg: "#F3F4F6" },
  amber: { bg: "#FACC15", fg: "#111827" },
}

export function FeatureCard({ icon, title, description, accent = "emerald" }: FeatureCardProps) {
  const a = accents[accent]
  return (
    <div
      className="group rounded-xl p-5 shadow-sm transition"
      style={{
        backgroundColor: "#F3F4F6",
        border: "1px solid rgba(17, 24, 39, 0.15)",
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="h-10 w-10 rounded-md flex items-center justify-center shrink-0"
          style={{ backgroundColor: a.bg, color: a.fg }}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-base font-semibold" style={{ color: "#111827" }}>
            {title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  )
}
