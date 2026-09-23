/** Course title for display in headers/nav; the stored value may be empty mid-edit. */
export function displayCourseTitle(title: string | undefined): string {
  return title?.trim() || "Untitled course"
}
