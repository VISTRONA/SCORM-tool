import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Copy, GripVertical, Trash2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { SlideCardContent } from "@/components/slides/SlideCardContent"
import { Button } from "@/components/ui/button"
import { SLIDE_TYPES } from "@/lib/slide-types"
import { cn } from "@/lib/utils"
import type { Slide } from "@/types/course"

interface SlideRowProps {
  slide: Slide
  index: number
  selected: boolean
  /** Reordering is off while the list is filtered (positions would be misleading). */
  dragDisabled?: boolean
  onSelect: (id: string) => void
  onDuplicate: (id: string) => void
  /** Ask to delete; the page shows the confirmation dialog. */
  onRequestDelete: (id: string) => void
}

/** One slide, rendered as a card in the sortable list. */
export function SlideRow({
  slide,
  index,
  selected,
  dragDisabled = false,
  onSelect,
  onDuplicate,
  onRequestDelete,
}: SlideRowProps) {
  const { ring } = SLIDE_TYPES[slide.type]

  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: slide.id, disabled: dragDisabled })

  // Keep the selected card visible (e.g. a newly added slide at the bottom of a long list).
  const [node, setNode] = useState<HTMLLIElement | null>(null)
  const ref = useCallback(
    (el: HTMLLIElement | null) => {
      setNodeRef(el)
      setNode(el)
    },
    [setNodeRef],
  )
  useEffect(() => {
    if (selected) node?.scrollIntoView({ block: "nearest" })
  }, [selected, node])

  return (
    <li
      ref={ref}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        "group relative flex items-start gap-1 rounded-xl border bg-background py-4 pr-4 pl-1.5 shadow-sm shadow-black/[0.04]",
        "transition-[box-shadow,translate,border-color] duration-150 ease-out",
        "has-[[data-slide-select]:focus-visible]:ring-2 has-[[data-slide-select]:focus-visible]:ring-ring/40",
        selected
          ? cn("border-transparent shadow-md shadow-black/[0.06] ring-2", ring)
          : "border-border hover:-translate-y-0.5 hover:border-input hover:shadow-lg hover:shadow-black/[0.07]",
        isDragging && "z-10 shadow-xl shadow-black/15",
      )}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-label={`Reorder slide ${index + 1}: ${slide.title || "Untitled slide"}`}
        aria-disabled={dragDisabled || undefined}
        title={dragDisabled ? "Clear the search to reorder slides" : undefined}
        className={cn(
          "grid h-10 w-5 shrink-0 touch-none place-items-center rounded-md text-muted-foreground outline-none",
          "opacity-30 transition-opacity focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/30",
          dragDisabled ? "cursor-not-allowed opacity-15" : "cursor-grab group-hover:opacity-100",
          isDragging && "cursor-grabbing opacity-100",
        )}
      >
        <GripVertical aria-hidden className="size-4" />
      </button>

      <button
        type="button"
        data-slide-select={slide.id}
        onClick={() => onSelect(slide.id)}
        aria-pressed={selected}
        className="flex min-w-0 flex-1 items-start gap-4 text-left outline-none"
      >
        <SlideCardContent slide={slide} index={index} reserveActions />
      </button>

      <div className="absolute right-3 bottom-3 flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onDuplicate(slide.id)}
          aria-label={`Duplicate slide ${index + 1}`}
          title="Duplicate slide"
          className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground focus-visible:opacity-100"
        >
          <Copy className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onRequestDelete(slide.id)}
          aria-label={`Delete slide ${index + 1}`}
          title="Delete slide"
          className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive focus-visible:opacity-100"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </li>
  )
}
