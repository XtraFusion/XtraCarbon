"use client"

import Link from "next/link"
import { useState } from "react"

export function SiteNavbar() {
  const [open, setOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur"
      style={{
        backgroundColor: "#F3F4F6",
        borderBottom: "1px solid rgba(17, 24, 39, 0.15)",
      }}
    >
      <nav aria-label="Primary" className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-full font-semibold"
            style={{ backgroundColor: "#059669", color: "#F3F4F6" }}
          >
            E
          </span>
          <span className="sr-only">EcoStack Home</span>
          <span className="font-semibold tracking-tight" style={{ color: "#111827" }}>
            EcoStack
          </span>
        </Link>

        <button
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 focus:outline-none"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{ color: "#111827" }}
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm hover:underline" style={{ color: "#111827" }}>
            Home
          </Link>
          <Link href="#about" className="text-sm hover:underline" style={{ color: "#111827" }}>
            About
          </Link>
          <Link href="/org/dashboard" className="text-sm hover:underline" style={{ color: "#111827" }}>
            Org
          </Link>
          <Link href="/user/dashboard" className="text-sm hover:underline" style={{ color: "#111827" }}>
            User
          </Link>
          <Link href="/wallet" className="text-sm hover:underline" style={{ color: "#111827" }}>
            Wallet
          </Link>
          <Link href="/submit/project" className="text-sm hover:underline" style={{ color: "#111827" }}>
            Submit Project
          </Link>
          <Link href="/submit/action" className="text-sm hover:underline" style={{ color: "#111827" }}>
            Submit Action
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm hover:underline" style={{ color: "#111827" }}>
              Login
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium focus:outline-none"
              style={{ backgroundColor: "#059669", color: "#F3F4F6" }}
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {open && (
        <div
          className="md:hidden"
          style={{ borderTop: "1px solid rgba(17, 24, 39, 0.15)", backgroundColor: "#F3F4F6" }}
        >
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-2">
            <Link href="/" className="py-2" style={{ color: "#111827" }} onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link href="#about" className="py-2" style={{ color: "#111827" }} onClick={() => setOpen(false)}>
              About
            </Link>
            <Link href="/org/dashboard" className="py-2" style={{ color: "#111827" }} onClick={() => setOpen(false)}>
              Org
            </Link>
            <Link href="/user/dashboard" className="py-2" style={{ color: "#111827" }} onClick={() => setOpen(false)}>
              User
            </Link>
            <Link href="/wallet" className="py-2" style={{ color: "#111827" }} onClick={() => setOpen(false)}>
              Wallet
            </Link>
            <Link href="/submit/project" className="py-2" style={{ color: "#111827" }} onClick={() => setOpen(false)}>
              Submit Project
            </Link>
            <Link href="/submit/action" className="py-2" style={{ color: "#111827" }} onClick={() => setOpen(false)}>
              Submit Action
            </Link>
            <Link href="/login" className="py-2" style={{ color: "#111827" }} onClick={() => setOpen(false)}>
              Login
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-md px-3 py-2"
              style={{ backgroundColor: "#059669", color: "#F3F4F6" }}
              onClick={() => setOpen(false)}
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
