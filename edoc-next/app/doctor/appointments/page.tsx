import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { Suspense } from "react"
import { SkeletonTable } from "@/components/ui/SkeletonBlock"

async function AppointmentsList({ userId }: { userId: string }) {
  const appointments = await prisma.appointment.findMany({
    where: { schedule: { doctor: { userId } } },
    include: { patient: true, schedule: true },
    orderBy: { schedule: { scheduledate: 'asc' } }
  })

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
        <thead>
          <tr className="bg-slate-50 border-b border-border">
            <th className="p-4 font-medium text-sm text-muted-foreground">Patient</th>
            <th className="p-4 font-medium text-sm text-muted-foreground">Session</th>
            <th className="p-4 font-medium text-sm text-muted-foreground">Date & Time</th>
            <th className="p-4 font-medium text-sm text-muted-foreground">Appt #</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((app) => (
            <tr key={app.id} className="border-b border-border last:border-0 hover:bg-slate-50/50 transition-colors">
              <td className="p-4 text-sm font-medium">{app.patient.pname}</td>
              <td className="p-4 text-sm">{app.schedule.title}</td>
              <td className="p-4 text-sm text-muted-foreground">
                {app.schedule.scheduledate.toLocaleDateString()} @ {app.schedule.scheduletime.toString()}
              </td>
              <td className="p-4 text-sm">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700">
                  #{app.apponum}
                </span>
              </td>
            </tr>
          ))}
          {appointments.length === 0 && (
            <tr>
              <td colSpan={4} className="p-8 text-center text-muted-foreground">No appointments yet.</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default async function DoctorAppointments() {
  const session = await auth()
  if (!session?.user?.id) return null

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Appointments</h1>
      <Suspense fallback={<SkeletonTable rows={4} cols={4} />}>
        <AppointmentsList userId={session.user.id} />
      </Suspense>
    </div>
  )
}
