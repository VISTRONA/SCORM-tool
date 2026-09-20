import { useEffect, useState } from "react"

/**
 * Keeps the last non-null `value` around for `ms` after it becomes null so an
 * exit animation can play. Returns the value to render and whether it is exiting.
 * `value` must be referentially stable between renders (memoize objects).
 */
export function useDelayedExit<T>(value: T | null, ms: number): { shown: T | null; exiting: boolean } {
  const [last, setLast] = useState<T | null>(value)

  // Track the latest non-null value during render (no effect, no extra commit).
  if (value !== null && value !== last) setLast(value)

  useEffect(() => {
    if (value !== null) return
    const t = setTimeout(() => setLast(null), ms)
    return () => clearTimeout(t)
  }, [value, ms])

  return { shown: value ?? last, exiting: value === null && last !== null }
}
