"use server"

import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/db"
import { auth } from "@/auth"
import { startOfToday } from "@/lib/dates"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function bookAppointment(scheduleId: number) {
  const session = await auth()
  if (!session || session.user.role !== 'patient') {
    throw new Error("Unauthorized")
  }

  if (!Number.isInteger(scheduleId)) {
    return { error: "This session no longer exists." }
  }

  const patient = await prisma.patient.findUnique({
    where: { userId: session.user.id }
  })

  if (!patient) throw new Error("Patient record not found")

  let error: string | null
  try {
    error = await prisma.$transaction(async (tx) => {
      // Lock the session row so that bookings for the same session run one at
      // a time: the capacity check and the insert below cannot interleave.
      const rows = await tx.$queryRaw<{ nop: number; scheduledate: Date }[]>`
        SELECT "nop", "scheduledate" FROM "Schedule" WHERE "id" = ${scheduleId} FOR UPDATE
      `
      const schedule = rows[0]
      if (!schedule) return "This session no longer exists."

      if (schedule.scheduledate < startOfToday()) {
        return "This session has already taken place."
      }

      const existing = await tx.appointment.findFirst({
        where: { scheduleId, patientId: patient.id },
        select: { id: true }
      })
      if (existing) return "You have already booked this session."

      const booked = await tx.appointment.aggregate({
        where: { scheduleId },
        _count: { _all: true },
        _max: { apponum: true }
      })
      if (booked._count._all >= schedule.nop) return "This session is fully booked."

      await tx.appointment.create({
        data: {
          patientId: patient.id,
          scheduleId,
          // Highest number so far + 1, so a cancellation never causes a repeat
          apponum: (booked._max.apponum ?? 0) + 1,
          appodate: new Date()
        }
      })

      return null
    })
  } catch (e) {
    // Unique constraint on (patient, session) — a duplicate slipped through
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      error = "You have already booked this session."
    } else {
      throw e
    }
  }

  if (error) return { error }

  revalidatePath('/patient/appointments')
  redirect('/patient/appointments')
}
