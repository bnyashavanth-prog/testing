// The clinic's time zone decides which calendar day counts as "today".
// Defaults to the zone the original PHP app used.
const APP_TIME_ZONE = process.env.APP_TIMEZONE || "Asia/Kolkata"

/**
 * Today's calendar date in the clinic's time zone, expressed as midnight UTC —
 * the form Prisma uses for `@db.Date` columns, so it can be compared directly
 * with `Schedule.scheduledate`.
 */
export function startOfToday(): Date {
  const ymd = new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())

  return new Date(`${ymd}T00:00:00Z`)
}
