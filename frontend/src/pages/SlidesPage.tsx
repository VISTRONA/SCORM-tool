import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Layers, SearchX } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { EmptyIcon } from "@/components/layout/EmptyIcon"
import { PageHeader } from "@/components/layout/PageHeader"
import { DeleteSlideDialog } from "@/components/slides/DeleteSlideDialog"
import { NewSlideMenu } from "@/components/slides/NewSlideMenu"
import { SlideDetailPanel } from "@/components/slides/SlideDetailPanel"
import { SlideRow } from "@/components/slides/SlideRow"
import { Button } from "@/components/ui/button"
import { useDelayedExit } from "@/hooks/useDelayedExit"
import { displayCourseTitle } from "@/lib/course-title"
import { slideMatches } from "@/lib/slide-search"
import { useCourseStore } from "@/store/courseStore"

const PANEL_EXIT_MS = 150

export function SlidesPage() {
  const course = useCourseStore((s) => s.document?.course)
  const selectedSlideId = useCourseStore((s) => s.selectedSlideId)
  const selectSlide = useCourseStore((s) => s.selectSlide)
  const removeSlide = useCourseStore((s) => s.removeSlide)
  const moveSlide = useCourseStore((s) => s.moveSlide)
  const duplicateSlide = useCourseStore((s) => s.duplicateSlide)
  const searchQuery = useCourseStore((s) => s.searchQuery)
  const setSearchQuery = useCourseStore((s) => s.setSearchQuery)

  // Delete confirmation. `pendingId` is kept while the dialog animates closed.
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pendingId, setPendingId] = useState<string | null>(null)

  const dragActive = useRef(false)

  const sensors = useSensors(
    // A small distance keeps plain clicks on the handle from starting a drag.
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const slides = useMemo(() => course?.slides ?? [], [course?.slides])
  // Filtered view keeps each slide's real position so numbering stays truthful.
  const filtering = searchQuery.trim() !== ""
  const visible = useMemo(
    () => slides.map((slide, index) => ({ slide, index })).filter(({ slide }) => slideMatches(slide, searchQuery)),
    [slides, searchQuery],
  )
  const selectedIndex = slides.findIndex((s) => s.id === selectedSlideId)
  const selected = selectedIndex >= 0 ? slides[selectedIndex] : null

  const panelValue = useMemo(
    () => (selected ? { slide: selected, index: selectedIndex } : null),
    [selected, selectedIndex],
  )
  const { shown: panel, exiting } = useDelayedExit(panelValue, PANEL_EXIT_MS)

  // Escape closes the detail panel (unless it's cancelling a drag or dismissing a menu/dialog).
  useEffect(() => {
    if (!selected) return
    const id = selected.id
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented || dragActive.current || dialogOpen) return
      if ((e.target as HTMLElement | null)?.closest('[role="menu"], [role="dialog"], [role="alertdialog"]')) return
      selectSlide(null)
      // Hand focus back to the row so keyboard users keep their place.
      requestAnimationFrame(() =>
        document.querySelector<HTMLElement>(`[data-slide-select="${CSS.escape(id)}"]`)?.focus(),
      )
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [selected, dialogOpen, selectSlide])

  if (!course) return null

  const pendingSlide = slides.find((s) => s.id === pendingId)
  const pendingTitle = pendingSlide?.title ?? ""

  const requestDelete = (id: string) => {
    setPendingId(id)
    setDialogOpen(true)
  }

  const duplicate = (id: string) => {
    if (duplicateSlide(id)) toast.success("Slide duplicated", { id: "slide-duplicated" })
  }

  const confirmDelete = () => {
    if (pendingId && removeSlide(pendingId)) toast.success("Slide deleted", { id: "slide-deleted" })
    setDialogOpen(false)
  }

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) moveSlide(String(active.id), String(over.id))
    endDrag()
  }
  // Delay clearing so the same Escape that cancels a drag doesn't also close the panel.
  const endDrag = () => setTimeout(() => (dragActive.current = false), 0)

  return (
    <>
      <PageHeader
        section={displayCourseTitle(course.title)}
        title="Slides"
        actions={
          <span className="rounded-md border border-border px-1.5 py-px text-xs text-muted-foreground">
            {filtering
              ? `${visible.length} of ${slides.length} slides`
              : `${slides.length} ${slides.length === 1 ? "slide" : "slides"}`}
          </span>
        }
      />

      {slides.length === 0 ? (
        <div className="grid flex-1 place-items-center px-5">
          <div className="flex max-w-xs flex-col items-center gap-2 text-center">
            <EmptyIcon icon={Layers} />
            <p className="mt-1 text-sm font-semibold tracking-tight">Your course is a blank canvas</p>
            <p className="text-[13px] text-muted-foreground">
              Add your first slide — text, an image, a video or a quiz — and build from there.
            </p>
            <NewSlideMenu
              trigger={
                <Button size="sm" className="mt-2">
                  Add slide
                </Button>
              }
            />
          </div>
        </div>
      ) : (
        <div className="relative flex min-h-0 flex-1 overflow-hidden">
          <div className="min-w-0 flex-1 overflow-y-auto bg-canvas">
            <div className="mx-auto max-w-4xl px-6 py-6">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
              onDragStart={() => (dragActive.current = true)}
              onDragEnd={onDragEnd}
              onDragCancel={endDrag}
            >
              <SortableContext items={visible.map(({ slide }) => slide.id)} strategy={verticalListSortingStrategy}>
                <ul aria-label="Slides" className="flex flex-col gap-3.5">
                  {visible.map(({ slide, index }) => (
                    <SlideRow
                      key={slide.id}
                      slide={slide}
                      index={index}
                      selected={slide.id === selected?.id}
                      dragDisabled={filtering}
                      onSelect={selectSlide}
                      onDuplicate={duplicate}
                      onRequestDelete={requestDelete}
                    />
                  ))}
                </ul>
              </SortableContext>
              {visible.length === 0 && (
                <div className="flex flex-col items-center gap-2 px-5 py-16 text-center">
                  <EmptyIcon icon={SearchX} />
                  <p className="mt-1 text-sm font-semibold tracking-tight">No slides match “{searchQuery.trim()}”</p>
                  <p className="text-[13px] text-muted-foreground">Try a different word, or clear the search to see everything.</p>
                  <Button variant="outline" size="sm" className="mt-1" onClick={() => setSearchQuery("")}>
                    Clear search
                  </Button>
                </div>
              )}
            </DndContext>
            </div>
          </div>
          {panel && (
            <SlideDetailPanel
              slide={panel.slide}
              index={panel.index}
              exiting={exiting}
              onClose={() => selectSlide(null)}
            />
          )}
        </div>
      )}

      <DeleteSlideDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        slideTitle={pendingTitle}
        isLastSlide={slides.length <= 1}
        onConfirm={confirmDelete}
      />
    </>
  )
}
