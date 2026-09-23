import type { ReactElement } from "react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SLIDE_TYPES } from "@/lib/slide-types"
import { useCourseStore } from "@/store/courseStore"
import type { SlideType } from "@/types/course"

const ORDER: SlideType[] = ["content", "image", "video", "quiz"]

/** Wraps any button (passed as `trigger`) in a "pick a slide type" menu. */
export function NewSlideMenu({ trigger }: { trigger: ReactElement }) {
  const addSlide = useCourseStore((s) => s.addSlide)
  const setSearchQuery = useCourseStore((s) => s.setSearchQuery)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={trigger} />
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Slide type</DropdownMenuLabel>
          {ORDER.map((type) => {
            const { icon: Icon, label, text } = SLIDE_TYPES[type]
            return (
              <DropdownMenuItem key={type} onClick={() => {
                  setSearchQuery("") // a filtered-out new slide would be invisible
                  if (addSlide(type)) toast.success(`${label} slide added`, { id: "slide-added" })
                }}>
                <Icon className={text} />
                {label}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
