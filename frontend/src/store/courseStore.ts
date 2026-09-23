import { create } from "zustand"
import { createSlide, uniqueSlideId } from "@/lib/slide-factory"
import type { Course, CourseDocument, Slide, SlideType } from "@/types/course"

export type AppView = "course" | "slides" | "settings"

type LoadStatus = "idle" | "loading" | "ready" | "error"

interface CourseState {
  /** The full Course JSON document, held as-is so no schema fields are dropped. */
  document: CourseDocument | null
  status: LoadStatus
  error: string | null

  view: AppView
  selectedSlideId: string | null
  /** Slides-list filter text (UI state only; never written to the course). */
  searchQuery: string

  loadSampleCourse: () => Promise<void>
  setView: (view: AppView) => void
  selectSlide: (id: string | null) => void
  /**
   * Immutably replace one slide. The updater should spread the existing slide
   * (`{ ...slide, title }`) so fields it doesn't know about are never dropped.
   */
  updateSlide: <T extends Slide>(id: string, updater: (slide: T) => T) => void
  /**
   * Shallow-merge editable course-level fields. `id` and `slides` are managed
   * elsewhere, and everything else on the document (schemaVersion, unknown fields) is untouched.
   */
  updateCourse: (patch: Partial<Pick<Course, "title" | "description" | "objectives">>) => void
  /** Append a new empty slide of `type`, select it and show the Slides view. Returns its id. */
  addSlide: (type: SlideType) => string | null
  /**
   * Remove a slide. Refuses (returns false) if it is the course's last slide —
   * the schema requires at least one. Clears the selection if it was selected.
   */
  removeSlide: (id: string) => boolean
  /**
   * Insert a copy of a slide (new unique id, title suffixed " (copy)") right after the original,
   * select it and show the Slides view. Returns the new id.
   */
  duplicateSlide: (id: string) => string | null
  setSearchQuery: (query: string) => void
  /** Move the slide `activeId` to the position currently held by `overId`. */
  moveSlide: (activeId: string, overId: string) => void
}

export const useCourseStore = create<CourseState>((set, get) => ({
  document: null,
  status: "idle",
  error: null,

  view: "course",
  selectedSlideId: null,
  searchQuery: "",

  loadSampleCourse: async () => {
    set({ status: "loading", error: null })
    try {
      // Shared integration fixture (see TEAM-01). Schema validation is UI-02's job.
      const mod = await import("@shared/sample-course.json")
      const document = mod.default as unknown as CourseDocument
      set({ document, status: "ready", selectedSlideId: null })
    } catch (err) {
      set({
        status: "error",
        error: err instanceof Error ? err.message : "Could not load the course.",
      })
    }
  },

  setView: (view) => set({ view }),
  selectSlide: (id) => set({ selectedSlideId: id }),

  updateSlide: (id, updater) =>
    set((state) => {
      if (!state.document) return state
      const { course } = state.document
      return {
        document: {
          ...state.document,
          course: {
            ...course,
            slides: course.slides.map((slide) => (slide.id === id ? updater(slide as never) : slide)),
          },
        },
      }
    }),

  updateCourse: (patch) =>
    set((state) =>
      state.document
        ? { document: { ...state.document, course: { ...state.document.course, ...patch } } }
        : state,
    ),

  addSlide: (type) => {
    const { document } = get()
    if (!document) return null
    const slide = createSlide(type, document.course.slides)
    set({
      document: {
        ...document,
        course: { ...document.course, slides: [...document.course.slides, slide] },
      },
      selectedSlideId: slide.id,
      view: "slides",
    })
    return slide.id
  },

  duplicateSlide: (id) => {
    const { document } = get()
    if (!document) return null
    const { slides } = document.course
    const index = slides.findIndex((s) => s.id === id)
    if (index < 0) return null
    // structuredClone keeps every field, including ones this UI doesn't know about.
    const original = slides[index]
    const copy: Slide = {
      ...structuredClone(original),
      id: uniqueSlideId(slides),
      title: `${original.title.trim() || "Untitled slide"} (copy)`,
    }
    const next = [...slides]
    next.splice(index + 1, 0, copy)
    set({
      document: { ...document, course: { ...document.course, slides: next } },
      selectedSlideId: copy.id,
      view: "slides",
    })
    return copy.id
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  removeSlide: (id) => {
    const { document, selectedSlideId } = get()
    if (!document) return false
    const { slides } = document.course
    if (slides.length <= 1 || !slides.some((s) => s.id === id)) return false
    set({
      document: {
        ...document,
        course: { ...document.course, slides: slides.filter((s) => s.id !== id) },
      },
      selectedSlideId: selectedSlideId === id ? null : selectedSlideId,
    })
    return true
  },

  moveSlide: (activeId, overId) =>
    set((state) => {
      if (!state.document || activeId === overId) return state
      const slides = [...state.document.course.slides]
      const from = slides.findIndex((s) => s.id === activeId)
      const to = slides.findIndex((s) => s.id === overId)
      if (from < 0 || to < 0) return state
      slides.splice(to, 0, ...slides.splice(from, 1))
      return { document: { ...state.document, course: { ...state.document.course, slides } } }
    }),
}))
