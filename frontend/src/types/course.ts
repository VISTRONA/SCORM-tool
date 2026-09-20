/**
 * TypeScript view of the shared Course JSON contract.
 * Source of truth: shared/course-schema.json and docs/COURSE_SCHEMA.md.
 * Do not diverge from those files here — propose changes there first.
 */

export type SlideType = "content" | "image" | "video" | "quiz"

interface BaseSlide {
  id: string
  type: SlideType
  title: string
}

export interface ContentSlide extends BaseSlide {
  type: "content"
  content: string
}

export interface ImageSlide extends BaseSlide {
  type: "image"
  content?: string
  asset: { path: string; alt?: string }
}

export interface VideoSlide extends BaseSlide {
  type: "video"
  asset: { path: string }
}

export interface QuizOption {
  id: string
  text: string
}

export interface QuizSlide extends BaseSlide {
  type: "quiz"
  question: string
  options: QuizOption[]
  correctOptionId: string
}

export type Slide = ContentSlide | ImageSlide | VideoSlide | QuizSlide

export interface Course {
  id: string
  title: string
  description?: string
  objectives: string[]
  slides: Slide[]
}

export interface CourseDocument {
  schemaVersion: "1.0"
  course: Course
}
