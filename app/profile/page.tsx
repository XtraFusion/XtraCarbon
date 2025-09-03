import { SiteNavbar } from "@/components/site-navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function ProfilePage() {
  return (
    <main className="min-h-dvh" style={{ backgroundColor: "#F3F4F6", color: "#111827" }}>
      <SiteNavbar />
      <section className="mx-auto max-w-3xl px-4 py-10">
        <Card style={{ backgroundColor: "#F3F4F6", border: "1px solid rgba(17,24,39,0.15)" }}>
          <CardHeader className="flex flex-col items-center gap-2">
            <Avatar className="h-16 w-16">
              <AvatarFallback style={{ backgroundColor: "#1E3A8A", color: "#F3F4F6" }}>JD</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <CardTitle>Jane Doe</CardTitle>
              <CardDescription>jane@example.com • Role: User</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                defaultValue="Jane Doe"
                style={{ backgroundColor: "#F3F4F6", color: "#111827", borderColor: "rgba(17,24,39,0.15)" }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself"
                defaultValue="Climate enthusiast and runner."
                style={{ backgroundColor: "#F3F4F6", color: "#111827", borderColor: "rgba(17,24,39,0.15)" }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact">Contact Info</Label>
              <Input
                id="contact"
                defaultValue="@janedoe"
                style={{ backgroundColor: "#F3F4F6", color: "#111827", borderColor: "rgba(17,24,39,0.15)" }}
              />
            </div>
            <Button style={{ backgroundColor: "#059669", color: "#F3F4F6" }}>Save Changes</Button>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
