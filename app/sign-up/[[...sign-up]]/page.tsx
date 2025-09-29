"use client"
import { SignUp, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Building2, Shield, ChevronRight, Check, Sparkles } from "lucide-react";
import { useUserSync } from "@/lib/hooks/useUserSync";

export default function SignupPage() {
  const { user, isSignedIn } = useUser();
  const { syncing } = useUserSync();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    if (isSignedIn && user && !syncing) {
      const role = user.publicMetadata.role || selectedRole;
      if (role === "org") {
        router.push("/org/dashboard");
      } else if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/buyer/dashboardoard");
      }
    }
  }, [isSignedIn, user, selectedRole, router, syncing]);

  const roles = [
    {
      id: "user",
      title: "Individual User",
      description: "Personal account for individual use",
      icon: User,
      color: "from-blue-500 to-cyan-500",
      features: ["Personal dashboard", "Basic features", "Community access"]
    },
    {
      id: "org",
      title: "Organization",
      description: "For businesses and teams",
      icon: Building2,
      color: "from-purple-500 to-pink-500",
      features: ["Team management", "Advanced analytics", "Priority support"]
    },
    {
      id: "admin",
      title: "Administrator",
      description: "Full system administration",
      icon: Shield,
      color: "from-amber-500 to-orange-500",
      features: ["Full access control", "System settings", "User management"]
    }
  ];

  const handleRoleSelect = (role:any) => {
    setSelectedRole(role);
    setShowSignUp(true);
  };

  if (showSignUp) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl"></div>
        </div>

        <section className="relative mx-auto max-w-md px-4 py-10">
          {/* Back button */}
          <button
            onClick={() => {
              setShowSignUp(false);
              setSelectedRole("");
            }}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>Back to role selection</span>
          </button>

          {/* Selected role indicator */}
          <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${roles.find(r => r.id === selectedRole)?.color} text-white`}>
                {/* { roles.find(r => r.id === selectedRole)?.icon && 
                (
                  // <div className="w-5 h-5">{roles.find(r => r.id === selectedRole).icon && <roles.find(r => r.id === selectedRole).icon className="w-5 h-5" />}</div>
                  <div className="w-5 h-5">{roles.find(r => r.id === selectedRole).icon && <roles.find(r => r.id === selectedRole).icon className="w-5 h-5" />}</div>
                )
              } */}
              </div>
              <div>
                <p className="text-sm text-gray-500">Signing up as</p>
                <p className="font-semibold text-gray-900">{roles.find(r => r.id === selectedRole)?.title}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <SignUp
            
            
              appearance={{
                elements: {
                  formButtonPrimary: { 
                    backgroundColor: "#059669", 
                    "&:hover": { backgroundColor: "#047857" } 
                  },
                  card: { 
                    backgroundColor: "#FFFFFF", 
                    border: "1px solid #E5E7EB", 
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                    borderRadius: "0.75rem"
                  },
                  headerTitle: { color: "#111827", fontSize: "1.5rem", fontWeight: "700" },
                  headerSubtitle: { color: "#6B7280" },
                  socialButtonsBlockButton: {
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    color: "#374151",
                    "&:hover": { backgroundColor: "#F9FAFB" },
                  },
                  socialButtonsBlockButtonText: { color: "#374151" },
                  formFieldInput: { 
                    backgroundColor: "#FFFFFF", 
                    color: "#111827", 
                    borderColor: "#E5E7EB",
                    "&:focus": { borderColor: "#059669", boxShadow: "0 0 0 3px rgba(5, 150, 105, 0.1)" }
                  },
                  formFieldLabel: { color: "#374151", fontWeight: "500" },
                  footerActionLink: { color: "#059669", fontWeight: "500" },
                  identityPreviewText: { color: "#111827" },
                  formResendCodeLink: { color: "#059669" },
                },
              }}
              redirectUrl={`/${selectedRole === "org" ? "org-dashboard" : selectedRole === "admin" ? "admin" : "user/dashboard"}`}
              signInUrl="/login"
              unsafeMetadata={{
                role: selectedRole,
                organizationName: selectedRole === 'org' ? '' : undefined
              }}
              afterSignUpUrl="/api/users/sync"
            />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-400/10 to-red-500/10 rounded-full blur-3xl"></div>
      </div>

      <section className="relative mx-auto max-w-6xl px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Get Started Today</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Account Type
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the role that best describes how you'll use our platform. You can always change this later.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                selectedRole === role.id ? 'scale-105' : ''
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${role.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`}></div>
              <div className={`relative bg-white rounded-2xl border-2 transition-all duration-300 ${
                selectedRole === role.id 
                  ? 'border-green-500 shadow-xl' 
                  : 'border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl'
              }`}>
                {/* Selected indicator */}
                {selectedRole === role.id && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}

                <div className="p-8">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.color} p-3 mb-4 text-white shadow-lg`}>
                    <role.icon className="w-full h-full" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{role.title}</h3>
                  <p className="text-gray-600 mb-6">{role.description}</p>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Select button */}
                  <button className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    selectedRole === role.id
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                    {selectedRole === role.id ? 'Selected' : 'Select This Role'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue button */}
        {selectedRole && (
          <div className="text-center">
            <button
              onClick={() => setShowSignUp(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Continue to Sign Up
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Login link */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-green-600 font-medium hover:text-green-700 transition-colors">
              Sign in instead
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}