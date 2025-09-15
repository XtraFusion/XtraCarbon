"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Building2, Shield, ChevronRight, Check, Sparkles, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SignupPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    organizationName: "",
    contactPhone: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          role: selectedRole,
          confirmPassword: undefined // Don't send confirmPassword to API
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect based on user role
        if (selectedRole === "org") {
          router.push("/org/dashboard");
        } else if (selectedRole === "admin") {
          router.push("/admin");
        } else {
          router.push("/user/dashboard");
        }
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
            <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Create your account
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Sign up as {roles.find(r => r.id === selectedRole)?.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="h-11"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="h-11"
                    />
                  </div>
                  
                  {selectedRole === "org" && (
                    <div className="space-y-2">
                      <Label htmlFor="organizationName">Organization Name</Label>
                      <Input
                        id="organizationName"
                        name="organizationName"
                        placeholder="Your Organization"
                        value={formData.organizationName}
                        onChange={handleInputChange}
                        className="h-11"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone Number (Optional)</Label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      className="h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create account"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <a
                      href="/sign-in"
                      className="text-green-600 font-medium hover:text-green-700 transition-colors"
                    >
                      Sign in
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
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