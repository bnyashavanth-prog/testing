import { prisma } from "@/lib/db"
import { cancelAppointment } from "./actions"
import { Suspense } from "react"
import { SkeletonTable } from "@/components/ui/SkeletonBlock"

async function AdminAppointmentsList() {
  const appointments = await prisma.appointment.findMany({
    include: {
      schedule: { include: { doctor: true } },
      patient: true
    },
    orderBy: { schedule: { scheduledate: 'desc' } }
  })

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-slate-50 border-b border-border">
            <th className="p-4 font-medium text-sm text-muted-foreground">Patient</th>
            <th className="p-4 font-medium text-sm text-muted-foreground">Doctor</th>
            <th className="p-4 font-medium text-sm text-muted-foreground">Session</th>
            <th className="p-4 font-medium text-sm text-muted-foreground">Date & Time</th>
            <th className="p-4 font-medium text-sm text-muted-foreground text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((app) => (
            <tr key={app.id} className="border-b border-border last:border-0 hover:bg-slate-50/50 transition-colors">
              <td className="p-4 text-sm font-medium">{app.patient.pname}</td>
              <td className="p-4 text-sm">Dr. {app.schedule.doctor.docname}</td>
              <td className="p-4 text-sm text-muted-foreground">{app.schedule.title}</td>
              <td className="p-4 text-sm text-muted-foreground">
                {app.schedule.scheduledate.toLocaleDateString()} @ {app.schedule.scheduletime.toISOString().substring(11, 16)}
              </td>
              <td className="p-4 text-right">
                <form action={cancelAppointment.bind(null, app.id)}>
                  <button className="text-red-600 hover:text-red-700 hover:bg-red-50 text-sm font-medium border border-red-200 rounded-lg px-3 py-1 transition-colors cursor-pointer">
                    Cancel
                  </button>
                </form>
              </td>
            </tr>
          ))}
          {appointments.length === 0 && (
            <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No appointments booked yet.</td></tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default async function AdminAppointments() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">All Appointments</h1>
      <Suspense fallback={<SkeletonTable rows={4} cols={5} />}>
        <AdminAppointmentsList />
      </Suspense>
    </div>
  )
}
