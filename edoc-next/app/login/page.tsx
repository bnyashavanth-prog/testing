"use client"

import { useState } from "react"
import { SubmitButton } from "./SubmitButton"
import { loginAction } from "./actions"
import { User, Eye, EyeOff, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { AuthBackground } from "@/components/auth/AuthBackground"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [emailValue, setEmailValue] = useState("")
  const [passwordValue, setPasswordValue] = useState("")

  return (
    <div className="flex flex-col md:flex-row min-h-[100dvh] md:min-h-screen bg-slate-50 relative overflow-x-hidden">
      {/* LEFT PANEL */}
      <AuthBackground />

      {/* RIGHT PANEL / FORM CONTAINER */}
      <div className="flex-1 flex flex-col min-h-[100dvh] md:min-h-screen w-full relative z-10 overflow-y-auto overflow-x-hidden justify-center items-center p-4 sm:p-6 md:p-10">
        
        {/* HEADER BRANDING */}
        <div className="w-full max-w-[420px] mb-6 flex items-center gap-2.5">
          <div className="text-teal-700">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 4C16 2.89543 15.1046 2 14 2H10C8.89543 2 8 2.89543 8 4V8H4C2.89543 8 2 8.89543 2 10V14C2 15.1046 2.89543 16 4 16H8V20C8 21.1046 8.89543 22 10 22H14C15.1046 22 16 21.1046 16 20V16H20C21.1046 16 22 15.1046 22 14V10C22 8.89543 21.1046 8 20 8H16V4Z" />
            </svg>
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800 tracking-tight leading-none">
              HealthCare<span className="text-teal-700">+</span>
            </div>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5">
              Better Care. Healthier Tomorrow.
            </div>
          </div>
        </div>

        {/* LOGIN CARD */}
        <div className="w-full max-w-[420px] bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-slate-100">
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center text-teal-700">
              <User size={26} />
            </div>
          </div>

          <h1 className="text-center text-2xl font-bold text-slate-800 mb-1">Welcome Back</h1>
          <p className="text-center text-sm text-slate-500 mb-6">Sign in to your account</p>

          {error && (
            <div className="mb-5 p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 text-center font-medium">
              {error}
            </div>
          )}

          <form
            action={async (formData) => {
              setError(null)
              const result = await loginAction(formData)
              if (result?.error) {
                setError(result.error)
              }
            }}
            className="space-y-4"
          >
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 outline-none transition-colors focus:border-teal-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 outline-none transition-colors focus:border-teal-600 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-teal-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <SubmitButton>Login</SubmitButton>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-teal-700 font-bold hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
