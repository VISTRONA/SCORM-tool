import { useRef } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteSlideDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Title of the slide being deleted (kept while the dialog animates closed). */
  slideTitle: string
  /** Deleting is blocked when this is the only slide left. */
  isLastSlide: boolean
  onConfirm: () => void
}

export function DeleteSlideDialog({ open, onOpenChange, slideTitle, isLastSlide, onConfirm }: DeleteSlideDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const name = slideTitle.trim() || "Untitled slide"

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent initialFocus={cancelRef}>
        {isLastSlide ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Can't delete the last slide</AlertDialogTitle>
              <AlertDialogDescription>
                A course needs at least one slide. Add another slide first if you want to remove "{name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel ref={cancelRef}>OK</AlertDialogCancel>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this slide?</AlertDialogTitle>
              <AlertDialogDescription>"{name}" will be removed from the course. This can't be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel ref={cancelRef}>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={onConfirm}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}
