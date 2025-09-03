import Link from "next/link"
import { SiteNavbar } from "@/components/site-navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SignupPage() {
  return (
    <main className="min-h-dvh" style={{ backgroundColor: "#F3F4F6", color: "#111827" }}>
      <SiteNavbar />
      <section className="mx-auto max-w-md px-4 py-10">
        <Card style={{ backgroundColor: "#F3F4F6", border: "1px solid rgba(17,24,39,0.15)" }}>
          <CardHeader>
            <CardTitle className="text-center">Create Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                style={{ backgroundColor: "#F3F4F6", color: "#111827", borderColor: "rgba(17,24,39,0.15)" }}
              />
            </div>
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
            <div className="grid gap-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="••••••••"
                style={{ backgroundColor: "#F3F4F6", color: "#111827", borderColor: "rgba(17,24,39,0.15)" }}
              />
            </div>
            <div className="grid gap-2">
              <Label>Role</Label>
              <Select>
                <SelectTrigger
                  style={{ backgroundColor: "#F3F4F6", color: "#111827", borderColor: "rgba(17,24,39,0.15)" }}
                >
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: "#F3F4F6", borderColor: "rgba(17,24,39,0.15)" }}>
                  <SelectItem value="organization">Organization</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" style={{ backgroundColor: "#059669", color: "#F3F4F6" }}>
              Create Account
            </Button>
            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline" style={{ color: "#1E3A8A" }}>
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
