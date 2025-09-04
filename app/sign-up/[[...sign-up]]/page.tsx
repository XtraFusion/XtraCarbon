import Link from "next/link"
import { SignUp } from "@clerk/nextjs"
import { SiteNavbar } from "@/components/site-navbar"

export default function SignupPage() {
  return (
    <main className="min-h-dvh" style={{ backgroundColor: "#F3F4F6", color: "#111827" }}>
      <SiteNavbar />
      <section className="mx-auto max-w-md px-4 py-10">
        <div className="flex justify-center">
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: {
                  backgroundColor: "#059669",
                  "&:hover": {
                    backgroundColor: "#047857"
                  }
                },
                card: {
                  backgroundColor: "#F3F4F6",
                  border: "1px solid rgba(17,24,39,0.15)",
                  boxShadow: "none"
                },
                headerTitle: {
                  color: "#111827"
                },
                headerSubtitle: {
                  color: "#6B7280"
                },
                socialButtonsBlockButton: {
                  backgroundColor: "#1E3A8A",
                  border: "1px solid #1E3A8A",
                  "&:hover": {
                    backgroundColor: "#1D4ED8"
                  }
                },
                socialButtonsBlockButtonText: {
                  color: "#F3F4F6"
                },
                formFieldInput: {
                  backgroundColor: "#F3F4F6",
                  color: "#111827",
                  borderColor: "rgba(17,24,39,0.15)"
                },
                formFieldLabel: {
                  color: "#111827"
                },
                footerActionLink: {
                  color: "#1E3A8A"
                },
                identityPreviewText: {
                  color: "#111827"
                },
                formResendCodeLink: {
                  color: "#1E3A8A"
                }
              }
            }}
            redirectUrl="/user/dashboard"
            signInUrl="/login"
          />
        </div>
      </section>
    </main>
  )
}
