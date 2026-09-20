import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useCourseStore } from "@/store/courseStore"

/** Inline slide filter shown under the sidebar's action row. */
export function SidebarSearch({ onClose }: { onClose: () => void }) {
  const query = useCourseStore((s) => s.searchQuery)
  const setSearchQuery = useCourseStore((s) => s.setSearchQuery)

  const close = () => {
    setSearchQuery("")
    onClose()
  }

  return (
    <div className="relative px-3 pb-2">
      <Search aria-hidden className="pointer-events-none absolute top-1/2 left-5.5 size-3.5 -translate-y-[calc(50%+4px)] text-muted-foreground" />
      <Input
        autoFocus
        type="text"
        role="searchbox"
        aria-label="Filter slides"
        placeholder="Filter slides…"
        value={query}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            // Handled here: don't let it also close the slide detail panel.
            e.preventDefault()
            if (query) setSearchQuery("")
            else close()
          }
        }}
        className="pr-7 pl-7"
      />
      <button
        type="button"
        onClick={close}
        aria-label="Clear search"
        className="absolute top-1/2 right-4.5 grid size-5 -translate-y-[calc(50%+4px)] place-items-center rounded-sm text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
      >
        <X className="size-3.5" />
      </button>
    </div>
  )
}
