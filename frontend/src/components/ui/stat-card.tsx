import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/** Small dashboard tile: tinted icon chip, big number, muted label. */
export function StatCard({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: LucideIcon
  value: number
  label: string
  /** Tint classes for the icon chip, e.g. "bg-amber-500/10 text-amber-600". */
  tone: string
}) {
  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-border bg-background px-4 py-3.5 shadow-sm shadow-black/[0.04]">
      <span aria-hidden className={cn("grid size-10 shrink-0 place-items-center rounded-full", tone)}>
        <Icon className="size-[18px]" />
      </span>
      <div className="min-w-0">
        <div className="text-2xl leading-7 font-bold tracking-tight tabular-nums">{value}</div>
        <div className="truncate text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  )
}
