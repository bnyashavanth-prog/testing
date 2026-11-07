import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { Suspense } from "react"
import { SkeletonTable } from "@/components/ui/SkeletonBlock"

async function DoctorPatientsList({ userId }: { userId: string }) {
  const appointments = await prisma.appointment.findMany({
    where: { schedule: { doctor: { userId } } },
    select: {
      patient: {
        select: {
          id: true,
          pname: true,
          ptel: true,
          paddress: true,
          user: { select: { email: true } }
        }
      }
    },
    distinct: ['patientId']
  })

  const patients = appointments.map(a => a.patient)

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-border">
            <th className="p-4 font-medium text-sm text-muted-foreground">Patient Name</th>
            <th className="p-4 font-medium text-sm text-muted-foreground">Email</th>
            <th className="p-4 font-medium text-sm text-muted-foreground">Phone</th>
            <th className="p-4 font-medium text-sm text-muted-foreground">Address</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id} className="border-b border-border last:border-0 hover:bg-slate-50/50 transition-colors">
              <td className="p-4 text-sm font-medium">{p.pname}</td>
              <td className="p-4 text-sm text-muted-foreground">{p.user.email}</td>
              <td className="p-4 text-sm text-muted-foreground">{p.ptel}</td>
              <td className="p-4 text-sm text-muted-foreground">{p.paddress}</td>
            </tr>
          ))}
          {patients.length === 0 && (
            <tr>
              <td colSpan={4} className="p-8 text-center text-muted-foreground">No patients booked yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default async function DoctorPatientsPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">My Patients</h1>
      <Suspense fallback={<SkeletonTable rows={3} cols={4} />}>
        <DoctorPatientsList userId={session.user.id} />
      </Suspense>
    </div>
  )
}
