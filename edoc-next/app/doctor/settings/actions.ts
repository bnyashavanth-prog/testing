"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const updateDoctorSchema = z.object({
  docname: z.string().min(2, "Name must be at least 2 characters"),
  doctel: z.string().min(10, "Phone number must be at least 10 digits"),
  docnic: z.string().min(5, "NIC must be at least 5 characters"),
  password: z.string().optional(),
})

export async function updateDoctorProfile(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== 'doctor') throw new Error("Unauthorized")

  const data = Object.fromEntries(formData.entries())
  const parsed = updateDoctorSchema.safeParse(data)

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { docname, doctel, docnic, password } = parsed.data

  try {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id }
    })

    if (!doctor) return { error: "Doctor not found" }

    await prisma.doctor.update({
      where: { id: doctor.id },
      data: { docname, doctel, docnic }
    })

    if (password && password.trim().length >= 6) {
      const hashedPassword = await bcrypt.hash(password.trim(), 10)
      await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashedPassword }
      })
    }

    revalidatePath('/doctor/settings')
    return { success: "Profile updated successfully!" }
  } catch (error) {
    return { error: "Failed to update profile." }
  }
}
