import { prisma } from "@/lib/db"
import { Suspense } from "react"
import { SkeletonTable } from "@/components/ui/SkeletonBlock"

async function AdminPatientsList() {
  const patients = await prisma.patient.findMany({ include: { user: true } })

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[550px]">
        <thead>
          <tr className="bg-slate-50 border-b border-border">
            <th className="p-4 font-medium text-sm text-muted-foreground">Name</th>
            <th className="p-4 font-medium text-sm text-muted-foreground">Email</th>
            <th className="p-4 font-medium text-sm text-muted-foreground">NIC</th>
            <th className="p-4 font-medium text-sm text-muted-foreground">Phone</th>
            <th className="p-4 font-medium text-sm text-muted-foreground">DOB</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((pat) => (
            <tr key={pat.id} className="border-b border-border last:border-0 hover:bg-slate-50/50 transition-colors">
              <td className="p-4 text-sm font-medium">{pat.pname}</td>
              <td className="p-4 text-sm text-muted-foreground">{pat.user.email}</td>
              <td className="p-4 text-sm text-muted-foreground">{pat.pnic}</td>
              <td className="p-4 text-sm text-muted-foreground">{pat.ptel}</td>
              <td className="p-4 text-sm text-muted-foreground">{pat.pdob.toLocaleDateString()}</td>
            </tr>
          ))}
          {patients.length === 0 && (
            <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No patients registered yet.</td></tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default async function AdminPatients() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Patients</h1>
      <Suspense fallback={<SkeletonTable rows={3} cols={5} />}>
        <AdminPatientsList />
      </Suspense>
    </div>
  )
}
