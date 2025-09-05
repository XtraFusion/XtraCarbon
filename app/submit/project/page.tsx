"use client"

import type React from "react"

// ...existing code...
import { useState } from "react"

export default function SubmitProjectPage() {
  const [submitting, setSubmitting] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      alert("Project submitted! (stub)")
      setSubmitting(false)
    }, 800)
  }

  return (
    <main className="min-h-dvh" style={{ backgroundColor: "#F3F4F6", color: "#111827" }}>
// ...existing code...
      <section className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Submit Project</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(17,24,39,0.75)" }}>
            Provide details to register your sustainability project.
          </p>
        </header>

        <form onSubmit={onSubmit} className="space-y-4">
          <div
            className="rounded-lg p-5 space-y-4"
            style={{ backgroundColor: "rgba(17,24,39,0.02)", border: "1px solid rgba(17,24,39,0.15)" }}
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Project Name
              </label>
              <input
                required
                id="name"
                name="name"
                type="text"
                className="mt-1 w-full rounded-md px-3 py-2"
                style={{
                  backgroundColor: "#F3F4F6",
                  border: "1px solid rgba(17,24,39,0.15)",
                  color: "#111827",
                }}
                placeholder="e.g., Community Solar Farm"
              />
            </div>

            <div>
              <label htmlFor="area" className="block text-sm font-medium">
                Area (sq. meters)
              </label>
              <input
                required
                id="area"
                name="area"
                type="number"
                min={0}
                className="mt-1 w-full rounded-md px-3 py-2"
                style={{
                  backgroundColor: "#F3F4F6",
                  border: "1px solid rgba(17,24,39,0.15)",
                  color: "#111827",
                }}
                placeholder="e.g., 500"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium">
                Location
              </label>
              <input
                required
                id="location"
                name="location"
                type="text"
                className="mt-1 w-full rounded-md px-3 py-2"
                style={{
                  backgroundColor: "#F3F4F6",
                  border: "1px solid rgba(17,24,39,0.15)",
                  color: "#111827",
                }}
                placeholder="City, Country"
              />
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-medium">
                Supporting File
              </label>
              <input
                required
                id="file"
                name="file"
                type="file"
                className="mt-1 block w-full text-sm"
                aria-describedby="file-desc"
                style={{ color: "#111827" }}
              />
              <p id="file-desc" className="mt-1 text-xs" style={{ color: "rgba(17,24,39,0.75)" }}>
                Upload proposal documents or evidence (PDF, images).
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium disabled:opacity-60"
            style={{ backgroundColor: "#059669", color: "#F3F4F6" }}
          >
            {submitting ? "Submitting..." : "Submit Project"}
          </button>
        </form>
      </section>
    </main>
  )
}
