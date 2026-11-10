"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { bookAppointment } from "./actions"

export default function BookButton({ scheduleId }: { scheduleId: number }) {
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleClick() {
    setError(null)
    startTransition(async () => {
      const result = await bookAppointment(scheduleId)
      if (result?.error) {
        setError(result.error)
        // Refresh the slot counts so the page matches what the server just told us
        router.refresh()
      }
    })
  }

  return (
    <div className="flex flex-col items-end gap-1.5 shrink-0">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="px-5 py-2 bg-primary text-white rounded-xl hover:bg-teal-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm cursor-pointer disabled:opacity-50"
      >
        {pending ? "Booking..." : "Book Now"}
      </button>
      {error && (
        <p role="alert" className="text-xs text-red-600 text-right max-w-[220px]">
          {error}
        </p>
      )}
    </div>
  )
}
