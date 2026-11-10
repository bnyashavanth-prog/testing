import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { updateDoctorProfile } from "./actions"

export default async function DoctorSettingsPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.user.id },
    include: { specialty: true, user: true }
  })

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-foreground mb-2">Doctor Profile & Settings</h1>
      <p className="text-sm text-muted-foreground mb-8">Manage your account information and preferences</p>

      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
        <form action={async (formData: FormData) => {
          "use server"
          await updateDoctorProfile(formData)
        }} className="space-y-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Doctor Name</label>
              <input
                name="docname"
                defaultValue={doctor?.docname}
                required
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-border rounded-xl focus:outline-none focus:border-primary focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Specialty (Managed by Admin)</label>
              <input
                value={doctor?.specialty?.sname || "General"}
                disabled
                className="w-full px-4 py-2.5 text-sm bg-slate-100 border border-slate-200 text-slate-500 rounded-xl cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
              <input
                name="doctel"
                defaultValue={doctor?.doctel}
                required
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-border rounded-xl focus:outline-none focus:border-primary focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">National ID / NIC</label>
              <input
                name="docnic"
                defaultValue={doctor?.docnic}
                required
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-border rounded-xl focus:outline-none focus:border-primary focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <h2 className="text-sm font-semibold text-slate-800 mb-1">Change Password (Optional)</h2>
            <p className="text-xs text-muted-foreground mb-4">Leave empty if you do not wish to change your password</p>
            <div className="max-w-sm">
              <input
                name="password"
                type="password"
                placeholder="New password (min 6 characters)"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-border rounded-xl focus:outline-none focus:border-primary focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors shadow-sm cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
