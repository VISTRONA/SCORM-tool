import { SLIDE_TYPES } from "@/lib/slide-types"
import { cn } from "@/lib/utils"
import type { SlideType } from "@/types/course"

const SIZES = {
  sm: { box: "size-5 rounded-[5px]", icon: "size-3" },
  md: { box: "size-6 rounded-md", icon: "size-3.5" },
  lg: { box: "size-10 rounded-full ring-1 ring-inset ring-current/10", icon: "size-[18px]" },
} as const

/** The slide type's icon on a soft tinted chip (`lg` is a circle). */
export function TypeChip({ type, size = "md", className }: { type: SlideType; size?: keyof typeof SIZES; className?: string }) {
  const { icon: Icon, tone } = SLIDE_TYPES[type]
  const { box, icon } = SIZES[size]
  return (
    <span aria-hidden className={cn("grid shrink-0 place-items-center", box, tone, className)}>
      <Icon className={icon} />
    </span>
  )
}

/** Pill with the type's name in its colour. */
export function TypeBadge({ type, className }: { type: SlideType; className?: string }) {
  const { label, tone } = SLIDE_TYPES[type]
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] leading-4 font-semibold", tone, className)}>{label}</span>
  )
}
