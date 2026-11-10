import { prisma } from "@/lib/db"
import { startOfToday } from "@/lib/dates"
import BookButton from "./BookButton"
import { Suspense } from "react"
import { SkeletonBlock } from "@/components/ui/SkeletonBlock"

function formatTime(date: Date) {
  try {
    const hours = date.getUTCHours()
    const minutes = date.getUTCMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = hours % 12 || 12
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
    return `${formattedHours}:${formattedMinutes} ${ampm}`
  } catch {
    return date.toLocaleTimeString()
  }
}

async function DoctorScheduleContent({ doctorId }: { doctorId: string }) {
  const id = Number(doctorId)
  if (!Number.isInteger(id)) return <div className="text-muted-foreground">Doctor not found</div>

  const [doctor, schedules] = await Promise.all([
    prisma.doctor.findUnique({
      where: { id },
      include: { specialty: true }
    }),
    prisma.schedule.findMany({
      where: {
        doctorId: id,
        scheduledate: { gte: startOfToday() }
      },
      include: { _count: { select: { appointments: true } } },
      orderBy: { scheduledate: 'asc' }
    })
  ])

  if (!doctor) return <div className="text-muted-foreground">Doctor not found</div>

  return (
    <>
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dr. {doctor.docname}</h1>
            <p className="text-sm text-muted-foreground">{doctor.specialty?.sname || 'General'}</p>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-foreground mb-4">Available Slots</h2>
      <div className="space-y-3">
        {schedules.map(schedule => {
          const isFull = schedule._count.appointments >= schedule.nop
          return (
            <div key={schedule.id} className={`bg-card border rounded-2xl p-5 shadow-sm flex justify-between items-center transition-all duration-200 ${isFull ? 'border-slate-200 opacity-60' : 'border-border hover:shadow-md hover:-translate-y-0.5'}`}>
              <div>
                <h3 className="font-semibold text-foreground">{schedule.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {schedule.scheduledate.toLocaleDateString()} at {formatTime(schedule.scheduletime)}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {schedule._count.appointments} / {schedule.nop} booked
                </p>
              </div>
              
              {isFull ? (
                <span className="px-4 py-2 bg-slate-100 text-slate-400 rounded-xl text-sm font-medium">Full</span>
              ) : (
                <BookButton scheduleId={schedule.id} />
              )}
            </div>
          )
        })}

        {schedules.length === 0 && (
          <div className="text-center text-muted-foreground py-8">No upcoming sessions scheduled for this doctor.</div>
        )}
      </div>
    </>
  )
}

export default async function DoctorSchedule({ params }: { params: Promise<{ doctorId: string }> }) {
  const { doctorId } = await params

  return (
    <div>
      <Suspense fallback={
        <div className="space-y-4">
          <SkeletonBlock className="h-24 rounded-2xl" />
          <SkeletonBlock className="h-6 w-40" />
          <SkeletonBlock className="h-20 rounded-2xl" />
          <SkeletonBlock className="h-20 rounded-2xl" />
        </div>
      }>
        <DoctorScheduleContent doctorId={doctorId} />
      </Suspense>
    </div>
  )
}
