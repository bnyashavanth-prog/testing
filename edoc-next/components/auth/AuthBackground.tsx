"use client"

import { Stethoscope, Pill, ClipboardList, Activity } from "lucide-react"

export function AuthBackground() {
  return (
    <div className="hidden md:flex relative w-[55%] h-screen flex-shrink-0 overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 items-center justify-center p-12 text-white">
      {/* Subtle modern geometric background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(20,184,166,0.25),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(15,118,110,0.3),transparent_50%)] pointer-events-none" />

      {/* Decorative medical icons with lightweight CSS floating */}
      <div className="absolute top-[12%] left-[10%] text-teal-400/20">
        <Stethoscope size={64} strokeWidth={1.5} />
      </div>
      <div className="absolute top-[20%] right-[15%] text-teal-300/20 rotate-45">
        <Pill size={48} strokeWidth={1.5} />
      </div>
      <div className="absolute bottom-[20%] left-[15%] text-teal-400/20">
        <ClipboardList size={56} strokeWidth={1.5} />
      </div>
      <div className="absolute bottom-[28%] right-[12%] text-teal-300/20">
        <Activity size={52} strokeWidth={1.5} />
      </div>

      {/* Center Welcome Card */}
      <div className="relative z-10 max-w-lg text-left space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-300 text-xs font-semibold tracking-wide">
          <Activity size={14} className="text-teal-400" />
          Modern Healthcare Platform
        </div>

        <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
          Streamlined Doctor Appointments.
        </h2>

        <p className="text-teal-100/80 text-base lg:text-lg leading-relaxed">
          Book consultations with top medical specialists in seconds. Simple, fast, and organized healthcare management for doctors and patients.
        </p>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-sm">
          <div>
            <div className="text-2xl font-bold text-white">50+</div>
            <div className="text-teal-200/70 text-xs mt-0.5">Medical Specialties</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">24/7</div>
            <div className="text-teal-200/70 text-xs mt-0.5">Online Booking Access</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MobileFloatingIcons() {
  return null
}
