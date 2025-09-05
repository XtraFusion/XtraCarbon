"use client"

import type React from "react"

// ...existing code...
import { useState } from "react"

export default function SubmitActionPage() {
  const [submitting, setSubmitting] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      alert("Action submitted! (stub)")
      setSubmitting(false)
    }, 800)
  }

  return (
    <main className="min-h-dvh" style={{ backgroundColor: "#F3F4F6", color: "#111827" }}>
// ...existing code...
      <section className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Submit Action</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(17,24,39,0.75)" }}>
            Provide proof of your eco-friendly action to earn tokens.
          </p>
        </header>

        <form onSubmit={onSubmit} className="space-y-4">
          <div
            className="rounded-lg p-5 space-y-4"
            style={{ backgroundColor: "rgba(17,24,39,0.02)", border: "1px solid rgba(17,24,39,0.15)" }}
          >
            <div>
              <label htmlFor="photo" className="block text-sm font-medium">
                Photo
              </label>
              <input
                required
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                className="mt-1 block w-full text-sm"
                style={{ color: "#111827" }}
              />
            </div>

            <div>
              <label htmlFor="gps" className="block text-sm font-medium">
                GPS Coordinates
              </label>
              <input
                required
                id="gps"
                name="gps"
                type="text"
                className="mt-1 w-full rounded-md px-3 py-2"
                placeholder="e.g., 37.7749° N, 122.4194° W"
                style={{
                  backgroundColor: "#F3F4F6",
                  border: "1px solid rgba(17,24,39,0.15)",
                  color: "#111827",
                }}
              />
            </div>

            <div>
              <label htmlFor="receipt" className="block text-sm font-medium">
                Receipt (optional)
              </label>
              <input
                id="receipt"
                name="receipt"
                type="file"
                accept="image/*,.pdf"
                className="mt-1 block w-full text-sm"
                style={{ color: "#111827" }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium disabled:opacity-60"
            style={{ backgroundColor: "#059669", color: "#F3F4F6" }}
          >
            {submitting ? "Submitting..." : "Submit Action"}
          </button>
        </form>
      </section>
    </main>
  )
}
