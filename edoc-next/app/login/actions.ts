"use server"

import { signIn } from "@/auth"
import { prisma } from "@/lib/db"

export async function loginAction(formData: FormData) {
  try {
    const rawEmail = formData.get("email")
    const rawPassword = formData.get("password")
    if (!rawEmail || !rawPassword) {
      return { error: "Please provide both email and password." }
    }

    const email = String(rawEmail).trim().toLowerCase()
    formData.set("email", email)

    // Lookup role to explicitly route to the right portal
    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true }
    })

    const targetUrl = user?.role === 'admin'
      ? '/admin'
      : user?.role === 'doctor'
        ? '/doctor'
        : user?.role === 'patient'
          ? '/patient'
          : '/'

    formData.set("redirectTo", targetUrl)

    await signIn("credentials", formData)
  } catch (error: any) {
    if (
      error.name === "RedirectError" || 
      error.digest?.startsWith("NEXT_REDIRECT") || 
      error.message === "NEXT_REDIRECT" ||
      error.message?.includes("NEXT_REDIRECT")
    ) {
      throw error;
    }
    console.error("LoginAction error:", error)
    return { error: "Invalid credentials. Please verify your email and password." }
  }
}
