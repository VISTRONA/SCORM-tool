import type { LucideIcon } from "lucide-react"
import { EmptyIcon } from "@/components/layout/EmptyIcon"
import { PageHeader } from "@/components/layout/PageHeader"
import { displayCourseTitle } from "@/lib/course-title"
import { useCourseStore } from "@/store/courseStore"

interface PlaceholderPageProps {
  title: string
  icon: LucideIcon
  message: string
}

export function PlaceholderPage({ title, icon: Icon, message }: PlaceholderPageProps) {
  const courseTitle = useCourseStore((s) => s.document?.course.title)
  return (
    <>
      <PageHeader section={courseTitle === undefined ? undefined : displayCourseTitle(courseTitle)} title={title} />
      <div className="grid flex-1 place-items-center px-5">
        <div className="flex max-w-xs flex-col items-center gap-2 text-center">
          <EmptyIcon icon={Icon} />
          <p className="mt-1 text-sm font-semibold tracking-tight">{title}</p>
          <p className="text-[13px] text-muted-foreground">{message}</p>
        </div>
      </div>
    </>
  )
}
