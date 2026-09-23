import type { Slide } from "@/types/course"

/** Everything a user might reasonably search for in a slide, lower-cased. */
function searchableText(slide: Slide): string {
  const parts: string[] = [slide.title]
  switch (slide.type) {
    case "content":
      parts.push(slide.content)
      break
    case "image":
      parts.push(slide.content ?? "", slide.asset.alt ?? "", slide.asset.path)
      break
    case "video":
      parts.push(slide.asset.path)
      break
    case "quiz":
      parts.push(slide.question, ...slide.options.map((o) => o.text))
      break
  }
  return parts.join("\n").toLowerCase()
}

/** Case-insensitive match; every whitespace-separated term must appear somewhere. An empty query matches all. */
export function slideMatches(slide: Slide, query: string): boolean {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return true
  const text = searchableText(slide)
  return terms.every((t) => text.includes(t))
}
