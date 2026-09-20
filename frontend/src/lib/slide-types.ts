import { CircleHelp, FileText, Image, Video, type LucideIcon } from "lucide-react"
import type { SlideType } from "@/types/course"

interface SlideTypeMeta {
  label: string
  icon: LucideIcon
  /** Soft tinted background + coloured foreground, for chips and badges. */
  tone: string
  /** Coloured foreground only. */
  text: string
  /** Solid bar colour (panel top accent). */
  bar: string
  /** Faint top-down wash of the same hue. */
  wash: string
  /** Selection ring colour. */
  ring: string
}

// Class strings are written out in full so Tailwind can see them.
export const SLIDE_TYPES: Record<SlideType, SlideTypeMeta> = {
  content: {
    label: "Text",
    icon: FileText,
    tone: "bg-blue-500/10 text-blue-600",
    text: "text-blue-600",
    bar: "bg-blue-500",
    wash: "from-blue-500/[0.07]",
    ring: "ring-blue-500",
  },
  image: {
    label: "Image",
    icon: Image,
    tone: "bg-violet-500/10 text-violet-600",
    text: "text-violet-600",
    bar: "bg-violet-500",
    wash: "from-violet-500/[0.07]",
    ring: "ring-violet-500",
  },
  video: {
    label: "Video",
    icon: Video,
    tone: "bg-rose-500/10 text-rose-600",
    text: "text-rose-600",
    bar: "bg-rose-500",
    wash: "from-rose-500/[0.07]",
    ring: "ring-rose-500",
  },
  quiz: {
    label: "Quiz",
    icon: CircleHelp,
    tone: "bg-amber-500/12 text-amber-600",
    text: "text-amber-600",
    bar: "bg-amber-500",
    wash: "from-amber-500/[0.08]",
    ring: "ring-amber-500",
  },
}
