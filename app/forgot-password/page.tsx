import Link from "next/link"
 
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-dvh" style={{ backgroundColor: "#F3F4F6", color: "#111827" }}>
 
      <section className="mx-auto max-w-md px-4 py-10">
        <Card style={{ backgroundColor: "#F3F4F6", border: "1px solid rgba(17,24,39,0.15)" }}>
          <CardHeader>
            <CardTitle className="text-center">Forgot Password</CardTitle>
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
            <Button className="w-full" style={{ backgroundColor: "#059669", color: "#F3F4F6" }}>
              Send Reset Link
            </Button>
            <p className="text-center text-sm">
              <Link href="/login" className="underline" style={{ color: "#1E3A8A" }}>
                Back to Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
