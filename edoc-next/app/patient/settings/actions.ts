"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const updatePatientSchema = z.object({
  pname: z.string().min(2, "Name must be at least 2 characters"),
  ptel: z.string().min(10, "Phone number must be at least 10 digits"),
  paddress: z.string().min(3, "Address must be at least 3 characters"),
  pnic: z.string().min(5, "NIC must be at least 5 characters"),
  password: z.string().optional(),
})

export async function updatePatientProfile(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== 'patient') throw new Error("Unauthorized")

  const data = Object.fromEntries(formData.entries())
  const parsed = updatePatientSchema.safeParse(data)

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { pname, ptel, paddress, pnic, password } = parsed.data

  try {
    const patient = await prisma.patient.findUnique({
      where: { userId: session.user.id }
    })

    if (!patient) return { error: "Patient not found" }

    await prisma.patient.update({
      where: { id: patient.id },
      data: { pname, ptel, paddress, pnic }
    })

    if (password && password.trim().length >= 6) {
      const hashedPassword = await bcrypt.hash(password.trim(), 10)
      await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashedPassword }
      })
    }

    revalidatePath('/patient/settings')
    return { success: "Profile updated successfully!" }
  } catch (error) {
    return { error: "Failed to update profile." }
  }
}
