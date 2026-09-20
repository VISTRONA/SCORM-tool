import { useEffect } from "react"
import { Settings } from "lucide-react"
import { CourseGate } from "@/components/layout/CourseGate"
import { AppShell } from "@/components/layout/AppShell"
import { CoursePage } from "@/pages/CoursePage"
import { PlaceholderPage } from "@/pages/PlaceholderPage"
import { SlidesPage } from "@/pages/SlidesPage"
import { Toaster } from "@/components/ui/sonner"
import { useCourseStore } from "@/store/courseStore"

export default function App() {
  const view = useCourseStore((s) => s.view)
  const loadSampleCourse = useCourseStore((s) => s.loadSampleCourse)

  useEffect(() => {
    void loadSampleCourse()
  }, [loadSampleCourse])

  return (
    <AppShell>
      {view === "course" && (
        <CourseGate>
          <CoursePage />
        </CourseGate>
      )}
      {view === "slides" && (
        <CourseGate>
          <SlidesPage />
        </CourseGate>
      )}
      {view === "settings" && (
        <PlaceholderPage title="Settings" icon={Settings} message="Nothing to configure just yet — course and app preferences will live here." />
      )}
      <Toaster />
    </AppShell>
  )
}
