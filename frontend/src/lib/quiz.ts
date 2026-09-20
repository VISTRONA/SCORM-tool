import type { QuizOption } from "@/types/course"

/** Next unused option id: a, b, c… then option-27, option-28… */
export function nextOptionId(options: QuizOption[]): string {
  const used = new Set(options.map((o) => o.id))
  for (let code = 97; code <= 122; code++) {
    const id = String.fromCharCode(code)
    if (!used.has(id)) return id
  }
  let n = options.length + 1
  while (used.has(`option-${n}`)) n++
  return `option-${n}`
}

/** Schema requires at least two options per quiz. */
export const MIN_QUIZ_OPTIONS = 2
