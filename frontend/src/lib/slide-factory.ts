import type { Slide, SlideType } from "@/types/course"

/** A slide id not used by any slide in `existing`. */
export function uniqueSlideId(existing: Slide[]): string {
  const used = new Set(existing.map((s) => s.id))
  let id: string
  do {
    id = `slide-${crypto.randomUUID().slice(0, 8)}`
  } while (used.has(id))
  return id
}

/** A new, empty slide of the given type with an id unique within `existing`. */
export function createSlide(type: SlideType, existing: Slide[]): Slide {
  const id = uniqueSlideId(existing)
  switch (type) {
    case "content":
      return { id, type, title: "New text slide", content: "" }
    case "image":
      return { id, type, title: "New image slide", content: "", asset: { path: "", alt: "" } }
    case "video":
      return { id, type, title: "New video slide", asset: { path: "" } }
    case "quiz":
      return {
        id,
        type,
        title: "New quiz",
        question: "",
        options: [
          { id: "a", text: "" },
          { id: "b", text: "" },
        ],
        correctOptionId: "a",
      }
  }
}
