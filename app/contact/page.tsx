// ...existing code...
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  return (
    <main className="min-h-dvh" style={{ backgroundColor: "#F3F4F6", color: "#111827" }}>
// ...existing code...
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card style={{ backgroundColor: "#F3F4F6", border: "1px solid rgba(17,24,39,0.15)" }}>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
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
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Subject"
                  style={{ backgroundColor: "#F3F4F6", color: "#111827", borderColor: "rgba(17,24,39,0.15)" }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="How can we help?"
                  style={{ backgroundColor: "#F3F4F6", color: "#111827", borderColor: "rgba(17,24,39,0.15)" }}
                />
              </div>
              <Button style={{ backgroundColor: "#059669", color: "#F3F4F6" }}>Send Message</Button>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: "#F3F4F6", border: "1px solid rgba(17,24,39,0.15)" }}>
            <CardHeader>
              <CardTitle>Organization Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>EcoStack HQ</p>
              <p>123 Greenway Blvd, Sustain City</p>
              <p>Email: support@ecostack.org</p>
              <p>Phone: +1 (555) 123-4567</p>
              <div className="flex gap-3 pt-2">
                <a href="#" className="underline" style={{ color: "#1E3A8A" }} aria-label="Twitter">
                  Twitter
                </a>
                <a href="#" className="underline" style={{ color: "#1E3A8A" }} aria-label="GitHub">
                  GitHub
                </a>
                <a href="#" className="underline" style={{ color: "#1E3A8A" }} aria-label="LinkedIn">
                  LinkedIn
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
