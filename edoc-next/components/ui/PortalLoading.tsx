import { SkeletonBlock, SkeletonTable } from "@/components/ui/SkeletonBlock"

// Shown the moment a portal link is clicked, while the server renders the page.
export function PortalLoading() {
  return (
    <div>
      <SkeletonBlock className="h-9 w-56 mb-8" />
      <SkeletonTable rows={4} cols={4} />
    </div>
  )
}
