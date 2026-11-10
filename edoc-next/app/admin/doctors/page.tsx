import { prisma } from "@/lib/db"
import DoctorForm from "./DoctorForm"
import { deleteDoctor } from "./actions"
import { Suspense } from "react"
import { SkeletonTable } from "@/components/ui/SkeletonBlock"

async function AdminDoctorsList() {
  const [doctors, specialties] = await Promise.all([
    prisma.doctor.findMany({
      include: { specialty: true, user: { select: { email: true } } }
    }),
    prisma.specialty.findMany()
  ])

  return (
    <>
      <DoctorForm specialties={specialties} />
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[550px]">
          <thead>
            <tr className="bg-slate-50 border-b border-border">
              <th className="p-4 font-medium text-sm text-muted-foreground">Name</th>
              <th className="p-4 font-medium text-sm text-muted-foreground">Email</th>
              <th className="p-4 font-medium text-sm text-muted-foreground">Specialty</th>
              <th className="p-4 font-medium text-sm text-muted-foreground">Phone</th>
              <th className="p-4 font-medium text-sm text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc.id} className="border-b border-border last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="p-4 text-sm font-medium">{doc.docname}</td>
                <td className="p-4 text-sm text-muted-foreground">{doc.user.email}</td>
                <td className="p-4 text-sm"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700">{doc.specialty.sname}</span></td>
                <td className="p-4 text-sm text-muted-foreground">{doc.doctel}</td>
                <td className="p-4 text-right">
                  <form action={async () => {
                    "use server"
                    await deleteDoctor(doc.id)
                  }}>
                    <button className="text-red-600 hover:text-red-700 hover:bg-red-50 text-sm font-medium border border-red-200 rounded-lg px-3 py-1 transition-colors cursor-pointer">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {doctors.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No doctors found.</td></tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </>
  )
}

export default async function AdminDoctors() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Doctors</h1>
      <Suspense fallback={<SkeletonTable rows={3} cols={5} />}>
        <AdminDoctorsList />
      </Suspense>
    </div>
  )
}
