import { ArrowRight, CircleHelp, Images, Layers, Plus, Target, X } from "lucide-react"
import { useId, useRef, type ReactNode } from "react"
import { toast } from "sonner"
import { EmptyIcon } from "@/components/layout/EmptyIcon"
import { PageHeader } from "@/components/layout/PageHeader"
import { NewSlideMenu } from "@/components/slides/NewSlideMenu"
import { SlideCardContent } from "@/components/slides/SlideCardContent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatCard } from "@/components/ui/stat-card"
import { Textarea } from "@/components/ui/textarea"
import { displayCourseTitle } from "@/lib/course-title"
import { cn } from "@/lib/utils"
import { useCourseStore } from "@/store/courseStore"

/** Looks like plain text until hovered/focused — click-to-edit. */
const inlineField =
  "border-transparent bg-transparent hover:bg-foreground/[0.04] focus-visible:border-ring focus-visible:bg-background"

function SectionHeader({ label, count, action }: { label: string; count: number; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <h2 className="text-[11px] font-semibold tracking-[0.1em] text-accent-strong uppercase">{label}</h2>
      <span className="rounded-full bg-primary/10 px-1.5 text-[11px] leading-4 font-medium tabular-nums text-accent-strong">
        {count}
      </span>
      {action && <div className="ml-auto">{action}</div>}
    </div>
  )
}

const card = "rounded-xl border border-border bg-background shadow-sm shadow-black/[0.04]"

export function CoursePage() {
  const document = useCourseStore((s) => s.document)
  const selectSlide = useCourseStore((s) => s.selectSlide)
  const setView = useCourseStore((s) => s.setView)
  const updateCourse = useCourseStore((s) => s.updateCourse)
  // Index of a just-added objective whose input should take focus once it mounts.
  const focusObjective = useRef<number | null>(null)
  const uid = useId()

  if (!document) return null

  const { course } = document
  const { objectives, slides } = course

  const quizCount = slides.filter((s) => s.type === "quiz").length
  const mediaCount = slides.filter((s) => s.type === "image" || s.type === "video").length

  const setObjective = (index: number, text: string) =>
    updateCourse({ objectives: objectives.map((o, i) => (i === index ? text : o)) })

  const addObjective = () => {
    focusObjective.current = objectives.length
    updateCourse({ objectives: [...objectives, ""] })
    toast.success("Objective added", { id: "objective-added" })
  }

  const removeObjective = (index: number) => {
    updateCourse({ objectives: objectives.filter((_, i) => i !== index) })
    toast("Objective removed", { id: "objective-removed" })
  }

  return (
    <>
      <PageHeader
        section="Course"
        title={displayCourseTitle(course.title)}
        actions={
          <span className="rounded-md border border-border px-1.5 py-px text-xs text-muted-foreground">
            {slides.length} {slides.length === 1 ? "slide" : "slides"}
          </span>
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto bg-canvas">
        {/* Hero */}
        <div className="relative overflow-hidden border-b border-border bg-gradient-to-br from-white via-white to-primary/[0.08]">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 right-0 size-80 rounded-full bg-primary/[0.09] blur-3xl"
          />
          <div className="relative mx-auto max-w-4xl px-8 pt-10 pb-8">
            <Input
              aria-label="Course title"
              placeholder="Untitled course"
              value={course.title}
              aria-invalid={course.title.trim() === ""}
              onChange={(e) => updateCourse({ title: e.target.value })}
              className={cn(inlineField, "-mx-3 h-14 max-w-full px-3 text-4xl leading-10 font-bold tracking-[-0.025em]")}
            />
            <Textarea
              id={`${uid}-description`}
              aria-label="Description"
              rows={2}
              placeholder="Add a description — what is this course about?"
              value={course.description ?? ""}
              onChange={(e) => updateCourse({ description: e.target.value })}
              className={cn(
                inlineField,
                "-mx-3 mt-1 min-h-14 max-w-2xl resize-none px-3 py-2 text-[15px] leading-6 text-muted-foreground",
              )}
            />

            <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard icon={Layers} value={slides.length} label={slides.length === 1 ? "Slide" : "Slides"} tone="bg-primary/10 text-primary" />
              <StatCard
                icon={Target}
                value={objectives.length}
                label={objectives.length === 1 ? "Objective" : "Objectives"}
                tone="bg-emerald-500/10 text-emerald-600"
              />
              <StatCard
                icon={CircleHelp}
                value={quizCount}
                label={quizCount === 1 ? "Quiz question" : "Quiz questions"}
                tone="bg-amber-500/12 text-amber-600"
              />
              <StatCard
                icon={Images}
                value={mediaCount}
                label={mediaCount === 1 ? "Image or video" : "Images & videos"}
                tone="bg-violet-500/10 text-violet-600"
              />
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-4xl flex-col gap-10 px-8 py-9">
          {/* Objectives */}
          <section aria-label="Objectives">
            <SectionHeader label="Objectives" count={objectives.length} />
            <div className={card}>
              {objectives.length === 0 && (
                <p className="px-5 py-4 text-[13px] text-muted-foreground">
                  No objectives yet — say what learners will be able to do after this course.
                </p>
              )}
              <ul className="divide-y divide-border">
                {objectives.map((objective, i) => (
                  <li key={i} className="group flex min-h-13 items-center gap-3.5 px-5 py-1.5">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-semibold tabular-nums text-accent-strong">
                      {i + 1}
                    </span>
                    <Input
                      aria-label={`Objective ${i + 1}`}
                      placeholder="Describe what learners will be able to do"
                      value={objective}
                      ref={(el) => {
                        if (el && focusObjective.current === i) {
                          el.focus()
                          focusObjective.current = null
                        }
                      }}
                      onChange={(e) => setObjective(i, e.target.value)}
                      className={cn(inlineField, "-mx-2 h-8 flex-1 px-2 text-sm")}
                    />
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeObjective(i)}
                      aria-label={`Remove objective ${i + 1}`}
                      title="Remove objective"
                      className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive focus-visible:opacity-100"
                    >
                      <X className="size-3.5" />
                    </Button>
                  </li>
                ))}
              </ul>
              <div className={cn("px-2.5 py-2", objectives.length > 0 && "border-t border-border")}>
                <Button variant="ghost" size="sm" onClick={addObjective} className="text-muted-foreground">
                  <Plus className="size-3.5" />
                  Add objective
                </Button>
              </div>
            </div>
          </section>

          {/* Slides */}
          <section aria-label="Slides">
            <SectionHeader
              label="Slides"
              count={slides.length}
              action={
                slides.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => setView("slides")} className="text-muted-foreground">
                    Open slides
                    <ArrowRight className="size-3.5" />
                  </Button>
                )
              }
            />
            {slides.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-input bg-background/60 px-5 py-12 text-center">
                <EmptyIcon icon={Layers} size="sm" />
                <p className="mt-1 text-sm font-semibold tracking-tight">Your course is a blank canvas</p>
                <p className="max-w-xs text-[13px] text-muted-foreground">
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
            ) : (
              <ul className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
                {slides.map((slide, i) => (
                  <li key={slide.id}>
                    <button
                      type="button"
                      onClick={() => {
                        selectSlide(slide.id)
                        setView("slides")
                      }}
                      className={cn(
                        card,
                        "flex h-full w-full items-start gap-4 p-4 text-left outline-none",
                        "transition-[box-shadow,translate,border-color] duration-150 ease-out",
                        "hover:-translate-y-0.5 hover:border-input hover:shadow-lg hover:shadow-black/[0.07]",
                        "focus-visible:ring-2 focus-visible:ring-ring/40",
                      )}
                    >
                      <SlideCardContent slide={slide} index={i} previewLines={1} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  )
}
