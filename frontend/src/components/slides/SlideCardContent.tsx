import { TypeBadge, TypeChip } from "@/components/slides/TypeChip"
import { getSlidePreview } from "@/lib/slide-preview"
import { cn } from "@/lib/utils"
import type { Slide } from "@/types/course"

/** Icon circle, number badge, title, type pill and preview — shared by the slide cards on both pages. */
export function SlideCardContent({
  slide,
  index,
  previewLines = 2,
  reserveActions = false,
}: {
  slide: Slide
  index: number
  previewLines?: 1 | 2
  /** Keep the preview clear of hover actions pinned to the card's bottom-right. */
  reserveActions?: boolean
}) {
  const preview = getSlidePreview(slide).trim()
  return (
    <>
      <TypeChip type={slide.type} size="lg" />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2.5">
          <span className="shrink-0 rounded-md bg-muted px-1.5 py-px text-[11px] leading-4 font-medium tabular-nums text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="min-w-0 truncate text-[15px] leading-6 font-semibold tracking-[-0.01em]">
            {slide.title || "Untitled slide"}
          </span>
          <TypeBadge type={slide.type} className="ml-auto shrink-0 max-sm:hidden" />
        </span>
        <span
          className={cn(
            "mt-1 block text-[13px] leading-5",
            previewLines === 1 ? "truncate" : "line-clamp-2",
            reserveActions && "pr-16",
            preview ? "text-muted-foreground" : "text-muted-foreground/60 italic",
          )}
        >
          {preview || "Nothing here yet"}
        </span>
      </span>
    </>
  )
}
