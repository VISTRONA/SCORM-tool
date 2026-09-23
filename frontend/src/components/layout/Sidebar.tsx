import {
  BookOpen,
  ChevronsUpDown,
  Layers,
  Search,
  Settings,
  SquarePen,
  type LucideIcon,
} from "lucide-react"
import { useState } from "react"
import { SidebarSearch } from "@/components/layout/SidebarSearch"
import { NewSlideMenu } from "@/components/slides/NewSlideMenu"
import { Button } from "@/components/ui/button"
import { displayCourseTitle } from "@/lib/course-title"
import { Skeleton } from "@/components/ui/skeleton"
import { slideMatches } from "@/lib/slide-search"
import { SLIDE_TYPES } from "@/lib/slide-types"
import { cn } from "@/lib/utils"
import { useCourseStore, type AppView } from "@/store/courseStore"

const NAV: { view: AppView; label: string; icon: LucideIcon }[] = [
  { view: "course", label: "Course", icon: BookOpen },
  { view: "slides", label: "Slides", icon: Layers },
  { view: "settings", label: "Settings", icon: Settings },
]

const rowBase =
  "relative flex h-7 w-full items-center gap-2 rounded-md px-2 text-left text-[13px] outline-none transition-colors " +
  "focus-visible:ring-2 focus-visible:ring-ring/30"

export function Sidebar() {
  const view = useCourseStore((s) => s.view)
  const setView = useCourseStore((s) => s.setView)
  const slides = useCourseStore((s) => s.document?.course.slides)
  const status = useCourseStore((s) => s.status)
  const courseTitle = useCourseStore((s) => s.document?.course.title)
  const selectedSlideId = useCourseStore((s) => s.selectedSlideId)
  const selectSlide = useCourseStore((s) => s.selectSlide)
  const searchQuery = useCourseStore((s) => s.searchQuery)
  const setSearchQuery = useCourseStore((s) => s.setSearchQuery)
  const [searchOpen, setSearchOpen] = useState(searchQuery !== "")

  const outlineSlides = slides?.filter((slide) => slideMatches(slide, searchQuery))

  const toggleSearch = () => {
    if (searchOpen) {
      setSearchQuery("")
      setSearchOpen(false)
    } else {
      // Searching filters the Slides list, so take the user there.
      setView("slides")
      setSearchOpen(true)
    }
  }

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Brand mark + current course */}
      <div className="flex h-11 items-center gap-2 px-3" title="Current course">
        <div className="grid size-5 shrink-0 place-items-center rounded-[5px] bg-primary text-[10px] font-semibold text-primary-foreground">
          HR
        </div>
        {courseTitle === undefined && status !== "error" ? (
          <Skeleton className="h-3.5 w-28" />
        ) : (
          <span className="truncate text-[13px] font-medium">{displayCourseTitle(courseTitle)}</span>
        )}
        <ChevronsUpDown className="ml-auto size-3.5 text-muted-foreground" />
      </div>

      {/* Primary action + search toggle */}
      <div className="flex gap-1.5 px-3 pb-2">
        <NewSlideMenu
          trigger={
            <Button size="sm" disabled={!slides} className="h-7 flex-1 justify-start gap-2 px-2 text-[13px] font-medium">
              <SquarePen className="size-3.5" />
              New slide
            </Button>
          }
        />
        <Button
          variant={searchOpen ? "secondary" : "outline"}
          size="icon-sm"
          disabled={!slides}
          onClick={toggleSearch}
          aria-label="Search slides"
          aria-expanded={searchOpen}
        >
          <Search className="size-3.5" />
        </Button>
      </div>
      {searchOpen && <SidebarSearch onClose={() => setSearchOpen(false)} />}

      <nav className="flex flex-col gap-px px-2" aria-label="Main">
        {NAV.map(({ view: target, label, icon: Icon }) => {
          const active = view === target
          return (
            <button
              key={target}
              type="button"
              onClick={() => setView(target)}
              aria-current={active ? "page" : undefined}
              className={cn(
                rowBase,
                active
                  ? "bg-primary/10 font-medium text-accent-strong before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:bg-primary"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className={cn("size-4 shrink-0", active ? "text-primary" : "text-muted-foreground")} />
              <span className="truncate">{label}</span>
              {target === "slides" && slides && (
                <span
                  className={cn(
                    "ml-auto rounded-full px-1.5 text-[11px] leading-4 font-medium tabular-nums",
                    active ? "bg-primary/15 text-accent-strong" : "text-muted-foreground",
                  )}
                >
                  {slides.length}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Slide outline (follows the search filter) */}
      <div className="mt-5 min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        {slides && slides.length > 0 && <div className="px-2 pb-1.5 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">Outline</div>}
        {status !== "ready" && status !== "error" && (
          <div className="flex flex-col gap-2 px-2 pt-1" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-3.5" style={{ width: `${85 - i * 12}%` }} />
            ))}
          </div>
        )}
        <ul className="flex flex-col gap-px">
          {outlineSlides?.map((slide) => {
            const { icon: Icon, text } = SLIDE_TYPES[slide.type]
            const active = view === "slides" && selectedSlideId === slide.id
            return (
              <li key={slide.id}>
                <button
                  type="button"
                  onClick={() => {
                    selectSlide(slide.id)
                    setView("slides")
                  }}
                  className={cn(
                    rowBase,
                    "pl-2.5",
                    active
                      ? "bg-primary/10 text-accent-strong"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className={cn("size-3.5 shrink-0", text)} />
                  <span className="truncate">{slide.title || "Untitled slide"}</span>
                </button>
              </li>
            )
          })}
        </ul>
        {searchQuery.trim() && outlineSlides?.length === 0 && (
          <p className="px-2 py-1 text-xs text-muted-foreground">No matching slides</p>
        )}
      </div>
    </aside>
  )
}
