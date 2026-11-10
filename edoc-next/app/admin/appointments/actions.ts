"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function cancelAppointment(appointmentId: number) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') throw new Error("Unauthorized")

  if (!Number.isInteger(appointmentId)) throw new Error("Appointment not found")

  // deleteMany so an already-cancelled appointment is a no-op rather than an error
  await prisma.appointment.deleteMany({ where: { id: appointmentId } })

  revalidatePath('/admin/appointments')
}
