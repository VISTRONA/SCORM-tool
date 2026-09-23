import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/** Lucide icon in a soft circle, for empty and error states. */
export function EmptyIcon({
  icon: Icon,
  tone = "accent",
  size = "md",
}: {
  icon: LucideIcon
  tone?: "accent" | "danger"
  size?: "sm" | "md"
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "grid place-items-center rounded-full",
        size === "md" ? "size-12 ring-8" : "size-9 ring-[6px]",
        tone === "accent" ? "bg-primary/10 text-primary ring-primary/[0.05]" : "bg-destructive/10 text-destructive ring-destructive/[0.05]",
      )}
    >
      <Icon className={size === "md" ? "size-5" : "size-4"} />
    </div>
  )
}
