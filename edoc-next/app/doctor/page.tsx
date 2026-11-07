import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { Suspense } from "react"
import { SkeletonStats } from "@/components/ui/SkeletonBlock"

async function DashboardStats({ userId }: { userId: string }) {
  const doctor = await prisma.doctor.findUnique({
    where: { userId },
    select: {
      docname: true,
      _count: {
        select: { schedules: true }
      }
    }
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="text-sm font-medium text-muted-foreground">Welcome back</div>
        <div className="mt-1 text-2xl font-bold text-foreground">{doctor?.docname || 'Doctor'}</div>
      </div>
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="text-sm font-medium text-muted-foreground">Scheduled Sessions</div>
        <div className="mt-1 text-3xl font-bold text-primary">{doctor?._count.schedules ?? 0}</div>
      </div>
    </div>
  )
}

export default async function DoctorDashboard() {
  const session = await auth()
  if (!session?.user?.id) return null

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard</h1>
      <Suspense fallback={<SkeletonStats count={2} />}>
        <DashboardStats userId={session.user.id} />
      </Suspense>
    </div>
  )
}
