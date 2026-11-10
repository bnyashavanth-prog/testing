import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { startOfToday } from "@/lib/dates"
import Link from "next/link"
import { Suspense } from "react"
import { SkeletonStats, SkeletonCard } from "@/components/ui/SkeletonBlock"
import { Calendar, Stethoscope, Phone, Mail, Clock, ArrowRight } from "lucide-react"

async function PatientDashboardContent({ userId }: { userId: string }) {
  const today = startOfToday()

  const [patient, doctors] = await Promise.all([
    prisma.patient.findUnique({
      where: { userId },
      select: {
        pname: true,
        _count: {
          select: {
            appointments: {
              where: { schedule: { scheduledate: { gte: today } } }
            }
          }
        }
      }
    }),
    prisma.doctor.findMany({
      include: {
        specialty: true,
        user: { select: { email: true } },
        _count: {
          select: {
            schedules: {
              where: { scheduledate: { gte: today } }
            }
          }
        }
      },
      orderBy: { docname: 'asc' }
    })
  ])

  const upcomingAppointments = patient?._count.appointments ?? 0

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-3">
            Patient Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome, {patient?.pname || 'Patient'}!
          </h1>
          <p className="text-teal-100/80 text-sm mt-1.5">
            Browse qualified doctors, check available consultation hours, and book your appointments online.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-muted-foreground">My Upcoming Appointments</div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700">
              <Calendar size={20} />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-primary">{upcomingAppointments}</div>
          <Link
            href="/patient/appointments"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mt-3"
          >
            View all bookings <ArrowRight size={13} />
          </Link>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-muted-foreground">Specialist Doctors Available</div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700">
              <Stethoscope size={20} />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-teal-700">{doctors.length}</div>
          <Link
            href="/patient/doctors"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:underline mt-3"
          >
            Explore all doctors <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Book Doctor List Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h2 className="text-xl font-bold text-foreground">Book an Appointment</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select a doctor below to view available session schedules and reserve your slot
            </p>
          </div>
          <Link
            href="/patient/doctors"
            className="text-xs font-semibold text-primary hover:underline self-start sm:self-auto"
          >
            View all ({doctors.length}) &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Doctor Avatar & Role */}
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shrink-0">
                    <Stethoscope size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-base text-foreground truncate">
                      Dr. {doc.docname}
                    </h3>
                    <span className="inline-block px-2.5 py-0.5 mt-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200/50">
                      {doc.specialty?.sname || "General Practitioner"}
                    </span>
                  </div>
                </div>

                {/* Contact & Availability Info */}
                <div className="space-y-1.5 text-xs text-slate-600 mb-5 pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone size={14} className="shrink-0 text-slate-400" />
                    <span>{doc.doctel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground truncate">
                    <Mail size={14} className="shrink-0 text-slate-400" />
                    <span className="truncate">{doc.user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-teal-700 font-medium pt-1">
                    <Clock size={14} className="shrink-0" />
                    <span>
                      {doc._count.schedules > 0
                        ? `${doc._count.schedules} open session${doc._count.schedules > 1 ? 's' : ''}`
                        : "No active sessions today"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Booking Button */}
              <Link
                href={`/patient/schedule/${doc.id}`}
                className="w-full py-2.5 px-4 bg-primary hover:bg-teal-700 text-white text-xs font-semibold rounded-xl text-center transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                Book Appointment <ArrowRight size={14} />
              </Link>
            </div>
          ))}

          {doctors.length === 0 && (
            <div className="col-span-full bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground text-sm">
              No doctors registered in the system yet. Please check back later.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default async function PatientDashboard() {
  const session = await auth()
  if (!session?.user?.id) return null

  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <SkeletonStats count={2} />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        </div>
      }
    >
      <PatientDashboardContent userId={session.user.id} />
    </Suspense>
  )
}
