"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LogOut } from "lucide-react"

interface NavLink {
  href: string
  label: string
  icon: React.ReactNode
}

interface PortalLayoutProps {
  portalName: string
  userEmail?: string | null
  links: NavLink[]
  logoutAction: () => Promise<void>
  children: React.ReactNode
}

export function PortalLayout({
  portalName,
  userEmail,
  links,
  logoutAction,
  children,
}: PortalLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* MOBILE TOP BAR (< md) */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-border px-4 py-3 flex items-center justify-between shadow-sm">
        <div>
          <div className="text-lg font-bold text-primary tracking-tight">eDoc</div>
          <div className="text-[11px] text-muted-foreground">{portalName}</div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* MOBILE MENU DROPDOWN (< md) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[57px] bottom-0 z-30 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border-b border-border shadow-lg p-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
            <nav className="space-y-1">
              {links.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className={isActive ? "text-white" : "text-slate-500"}>
                      {link.icon}
                    </span>
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            <div className="pt-3 border-t border-border mt-3">
              <div className="text-xs text-muted-foreground mb-2 px-1 truncate">
                {userEmail}
              </div>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR (>= md) */}
      <aside className="hidden md:flex w-64 bg-white border-r border-border flex-col shadow-sm shrink-0 h-screen sticky top-0">
        <div className="p-5 border-b border-border">
          <div className="text-xl font-bold text-primary tracking-tight">eDoc</div>
          <div className="text-xs text-muted-foreground mt-0.5">{portalName}</div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-accent text-primary font-semibold"
                    : "text-slate-600 hover:bg-accent hover:text-primary"
                }`}
              >
                <span className={isActive ? "text-primary" : "text-slate-500"}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="mb-3 text-xs text-muted-foreground truncate">{userEmail}</div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors px-4 py-2 rounded-xl cursor-pointer"
            >
              <LogOut size={15} />
              Log Out
            </button>
          </form>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-background">
        <div className="max-w-7xl mx-auto w-full">{children}</div>
      </main>
    </div>
  )
}
