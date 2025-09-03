import Link from "next/link"
import { SiteNavbar } from "@/components/site-navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  return (
    <main className="min-h-dvh" style={{ backgroundColor: "#F3F4F6", color: "#111827" }}>
      <SiteNavbar />
      <section className="mx-auto max-w-md px-4 py-10">
        <Card style={{ backgroundColor: "#F3F4F6", border: "1px solid rgba(17,24,39,0.15)" }}>
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                style={{ backgroundColor: "#F3F4F6", color: "#111827", borderColor: "rgba(17,24,39,0.15)" }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                style={{ backgroundColor: "#F3F4F6", color: "#111827", borderColor: "rgba(17,24,39,0.15)" }}
              />
            </div>
            <div className="flex items-center justify-between">
              <Link href="/forgot-password" className="text-sm underline" style={{ color: "#1E3A8A" }}>
                Forgot Password?
              </Link>
            </div>
            <Button className="w-full" style={{ backgroundColor: "#059669", color: "#F3F4F6" }}>
              Login
            </Button>
            <Button
              className="w-full inline-flex items-center gap-2"
              style={{ backgroundColor: "#1E3A8A", color: "#F3F4F6" }}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="#FACC15">
                <path d="M3 3l7.5 4.5L12 9l1.5-1.5L21 3l-3.5 6.5L21 18l-6-1.5L12 21l-3-4.5L3 18l3.5-8.5L3 3z" />
              </svg>
              Connect Wallet
            </Button>
            <p className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline" style={{ color: "#1E3A8A" }}>
                Create one
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
