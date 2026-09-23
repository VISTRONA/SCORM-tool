import type { ReactNode } from "react"
import { TriangleAlert } from "lucide-react"
import { EmptyIcon } from "@/components/layout/EmptyIcon"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useCourseStore } from "@/store/courseStore"

/** Placeholder shaped like the Course page (hero, stat tiles, cards) while the course loads. */
function ListSkeleton() {
  return (
    <>
      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-border px-5">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-3.5 w-40" />
      </div>
      <div className="min-h-0 flex-1 overflow-hidden bg-canvas" aria-hidden>
        <div className="border-b border-border bg-background">
          <div className="mx-auto flex max-w-4xl flex-col gap-3 px-8 pt-10 pb-8">
            <Skeleton className="h-9 w-80 max-w-full" />
            <Skeleton className="h-4 w-96 max-w-full" />
            <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[68px] rounded-xl" />
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto flex max-w-4xl flex-col gap-3.5 px-8 py-9">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[76px] rounded-xl" />
          ))}
        </div>
      </div>
    </>
  )
}

/** Renders `children` only once a course document is available. */
export function CourseGate({ children }: { children: ReactNode }) {
  const status = useCourseStore((s) => s.status)
  const error = useCourseStore((s) => s.error)
  const document = useCourseStore((s) => s.document)

  if (status === "error") {
    return (
      <>
        <PageHeader title="Couldn't load course" />
        <div className="grid flex-1 place-items-center px-5">
          <div className="flex max-w-xs flex-col items-center gap-2 text-center" role="alert">
            <EmptyIcon icon={TriangleAlert} tone="danger" />
            <p className="mt-1 text-sm font-semibold tracking-tight">We couldn't open this course</p>
            <p className="text-[13px] break-words text-muted-foreground">{error}</p>
            {/*
              A failed dynamic import() is cached by the browser, so calling loadSampleCourse again
              wouldn't re-request it. Reload instead; switch to the store's loader once it uses fetch.
            */}
            <Button variant="outline" size="sm" className="mt-1" onClick={() => window.location.reload()}>
              Reload page
            </Button>
          </div>
        </div>
      </>
    )
  }

  if (!document) {
    return (
      <div className="flex min-h-0 flex-1 flex-col" role="status" aria-busy="true" aria-label="Loading course">
        <ListSkeleton />
      </div>
    )
  }

  return <>{children}</>
}
