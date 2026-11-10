import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { startOfToday } from "@/lib/dates"
import { Suspense } from "react"
import { SkeletonStats } from "@/components/ui/SkeletonBlock"

async function PatientDashboardStats({ userId }: { userId: string }) {
  const patient = await prisma.patient.findUnique({
    where: { userId },
    select: {
      pname: true,
      _count: {
        select: {
          appointments: {
            where: { schedule: { scheduledate: { gte: startOfToday() } } }
          }
        }
      }
    }
  })

  const upcomingAppointments = patient?._count.appointments ?? 0

  return (
    <>
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-foreground">Welcome, {patient?.pname || 'Patient'}!</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your appointments and find doctors</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="text-sm font-medium text-muted-foreground">Upcoming Appointments</div>
          <div className="mt-1 text-3xl font-bold text-primary">{upcomingAppointments}</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="text-sm font-medium text-muted-foreground mb-3">Quick Actions</div>
          <div className="flex flex-col gap-2">
            <a href="/patient/doctors" className="text-primary text-sm font-medium hover:underline">Book a new appointment &rarr;</a>
            <a href="/patient/appointments" className="text-primary text-sm font-medium hover:underline">View my history &rarr;</a>
          </div>
        </div>
      </div>
    </>
  )
}

export default async function PatientDashboard() {
  const session = await auth()
  if (!session?.user?.id) return null

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard</h1>
      <Suspense fallback={<SkeletonStats count={2} />}>
        <PatientDashboardStats userId={session.user.id} />
      </Suspense>
    </div>
  )
}
