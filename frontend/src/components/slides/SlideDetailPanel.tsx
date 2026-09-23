import { Plus, X } from "lucide-react"
import { useId, useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { MIN_QUIZ_OPTIONS, nextOptionId } from "@/lib/quiz"
import { TypeChip } from "@/components/slides/TypeChip"
import { SLIDE_TYPES } from "@/lib/slide-types"
import { cn } from "@/lib/utils"
import { useCourseStore } from "@/store/courseStore"
import type { ContentSlide, ImageSlide, QuizSlide, Slide, VideoSlide } from "@/types/course"

/** Returns a patcher that shallow-merges into one slide, preserving all other fields. */
function useSlidePatch<T extends Slide>(slide: T) {
  const updateSlide = useCourseStore((s) => s.updateSlide)
  return (patch: Partial<Omit<T, "id" | "type">>) => updateSlide<T>(slide.id, (s) => ({ ...s, ...patch }))
}

function FormField({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string
  htmlFor?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} className="text-xs font-normal text-muted-foreground">
        {label}
        {hint && <span className="ml-auto text-muted-foreground/70">{hint}</span>}
      </Label>
      {children}
    </div>
  )
}

function ContentFields({ slide }: { slide: ContentSlide }) {
  const patch = useSlidePatch(slide)
  const id = useId()
  return (
    <FormField label="Content" htmlFor={id}>
      <Textarea id={id} rows={8} value={slide.content} onChange={(e) => patch({ content: e.target.value })} />
    </FormField>
  )
}

function ImageFields({ slide }: { slide: ImageSlide }) {
  const patch = useSlidePatch(slide)
  const uid = useId()
  return (
    <>
      <FormField label="Content" htmlFor={`${uid}-content`} hint="Optional">
        <Textarea
          id={`${uid}-content`}
          rows={5}
          value={slide.content ?? ""}
          onChange={(e) => patch({ content: e.target.value })}
        />
      </FormField>
      <FormField label="Image path" htmlFor={`${uid}-path`}>
        <Input
          id={`${uid}-path`}
          value={slide.asset.path}
          aria-invalid={slide.asset.path.trim() === ""}
          onChange={(e) => patch({ asset: { ...slide.asset, path: e.target.value } })}
        />
      </FormField>
      <FormField label="Alt text" htmlFor={`${uid}-alt`} hint="Describes the image for screen readers">
        <Input
          id={`${uid}-alt`}
          value={slide.asset.alt ?? ""}
          onChange={(e) => patch({ asset: { ...slide.asset, alt: e.target.value } })}
        />
      </FormField>
    </>
  )
}

function VideoFields({ slide }: { slide: VideoSlide }) {
  const patch = useSlidePatch(slide)
  const id = useId()
  return (
    <FormField label="Video path" htmlFor={id}>
      <Input
        id={id}
        value={slide.asset.path}
        aria-invalid={slide.asset.path.trim() === ""}
        onChange={(e) => patch({ asset: { ...slide.asset, path: e.target.value } })}
      />
    </FormField>
  )
}

function QuizFields({ slide }: { slide: QuizSlide }) {
  const patch = useSlidePatch(slide)
  const uid = useId()
  const [justAddedId, setJustAddedId] = useState<string | null>(null)
  const { options } = slide
  const canRemove = options.length > MIN_QUIZ_OPTIONS

  const setOptionText = (optionId: string, text: string) =>
    patch({ options: options.map((o) => (o.id === optionId ? { ...o, text } : o)) })

  const addOption = () => {
    const id = nextOptionId(options)
    setJustAddedId(id)
    patch({ options: [...options, { id, text: "" }] })
  }

  const removeOption = (optionId: string) => {
    const remaining = options.filter((o) => o.id !== optionId)
    // Never leave correctOptionId pointing at a deleted option.
    const correctOptionId =
      slide.correctOptionId === optionId ? (remaining[0]?.id ?? slide.correctOptionId) : slide.correctOptionId
    patch({ options: remaining, correctOptionId })
  }

  return (
    <>
      <FormField label="Question" htmlFor={`${uid}-question`}>
        <Textarea
          id={`${uid}-question`}
          rows={3}
          value={slide.question}
          aria-invalid={slide.question.trim() === ""}
          onChange={(e) => patch({ question: e.target.value })}
        />
      </FormField>

      <div className="flex flex-col gap-1.5">
        <span id={`${uid}-options`} className="flex items-center text-xs text-muted-foreground">
          Options
          <span className="ml-auto text-muted-foreground/70">Select the correct answer</span>
        </span>
        <RadioGroup
          aria-labelledby={`${uid}-options`}
          value={slide.correctOptionId}
          onValueChange={(value) => patch({ correctOptionId: value as string })}
          className="gap-1.5"
        >
          {options.map((option, i) => (
            <div key={option.id} className="flex items-center gap-2">
              <RadioGroupItem value={option.id} aria-label={`Mark option ${i + 1} as correct`} />
              <Input
                value={option.text}
                placeholder={`Option ${i + 1}`}
                aria-label={`Option ${i + 1} text`}
                aria-invalid={option.text.trim() === ""}
                autoFocus={option.id === justAddedId}
                onChange={(e) => setOptionText(option.id, e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={!canRemove}
                onClick={() => removeOption(option.id)}
                aria-label={`Remove option ${i + 1}`}
                title={canRemove ? "Remove option" : `A quiz needs at least ${MIN_QUIZ_OPTIONS} options`}
                className="text-muted-foreground"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          ))}
        </RadioGroup>
        <Button variant="ghost" size="sm" onClick={addOption} className="w-fit text-muted-foreground">
          <Plus className="size-3.5" />
          Add option
        </Button>
      </div>
    </>
  )
}

function TypeFields({ slide }: { slide: Slide }) {
  switch (slide.type) {
    case "content":
      return <ContentFields slide={slide} />
    case "image":
      return <ImageFields slide={slide} />
    case "video":
      return <VideoFields slide={slide} />
    case "quiz":
      return <QuizFields slide={slide} />
  }
}

interface SlideDetailPanelProps {
  slide: Slide
  index: number
  /** Playing the slide-out animation; the panel is inert until unmounted. */
  exiting?: boolean
  onClose: () => void
}

export function SlideDetailPanel({ slide, index, exiting = false, onClose }: SlideDetailPanelProps) {
  const { label, bar, wash } = SLIDE_TYPES[slide.type]
  const patch = useSlidePatch<Slide>(slide)
  const titleId = useId()

  return (
    <aside
      aria-label="Slide details"
      inert={exiting}
      className={cn(
        "relative flex w-[360px] max-w-full shrink-0 flex-col overflow-hidden border-l border-border bg-background duration-150 ease-out",
        // Below lg there isn't room beside the list, so the panel overlays it.
        "max-lg:absolute max-lg:inset-y-0 max-lg:right-0 max-lg:z-20 max-lg:shadow-xl max-lg:shadow-black/5",
        exiting
          ? "animate-out fade-out-0 slide-out-to-right-8 fill-mode-forwards"
          : "animate-in fade-in-0 slide-in-from-right-8",
      )}
    >
      {/* Top accent in the slide type's colour */}
      <span aria-hidden className={cn("absolute inset-x-0 top-0 z-10 h-0.5", bar)} />
      <span aria-hidden className={cn("pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b to-transparent", wash)} />

      <div className="relative flex h-11 shrink-0 items-center gap-2 border-b border-border/70 px-4">
        <TypeChip type={slide.type} />
        <span className="text-[13px] font-semibold">Slide {index + 1}</span>
        <span className="text-[13px] text-muted-foreground">{label}</span>
        <Button variant="ghost" size="icon-sm" className="ml-auto" onClick={onClose} aria-label="Close details">
          <X className="size-3.5" />
        </Button>
      </div>

      {/* Keyed by slide so focus/scroll state doesn't leak between slides. */}
      <div key={slide.id} className="relative flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
        <FormField label="Title" htmlFor={titleId}>
          <Input id={titleId} value={slide.title} onChange={(e) => patch({ title: e.target.value })} />
        </FormField>

        <TypeFields slide={slide} />

        <p className="mt-auto pt-2 font-mono text-xs text-muted-foreground/70">id: {slide.id}</p>
      </div>
    </aside>
  )
}
