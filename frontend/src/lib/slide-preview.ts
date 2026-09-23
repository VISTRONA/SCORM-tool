import type { Slide } from "@/types/course"

/** One-line text summarising a slide's body, for list rows. */
export function getSlidePreview(slide: Slide): string {
  switch (slide.type) {
    case "content":
      return slide.content
    case "image":
      return slide.content || slide.asset.alt || slide.asset.path
    case "video":
      return slide.asset.path
    case "quiz":
      return slide.question
  }
}
