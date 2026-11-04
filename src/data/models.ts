export type StudyDay = 'mon' | 'tue' | 'wed' | 'thu';
export type DayKey = StudyDay | 'fri' | 'sat';

export interface Resource {
  label: string;
  url: string;
}

export interface Lesson {
  id: string;
  day: StudyDay;
  title: string;
  learn: string[];
  research: string[];
  resources: Resource[];
}

export interface Assignment {
  id: string;
  title: string;
  brief: string;
  doneWhen: string[];
  submit: string;
}

export interface Review {
  id: string;
  questions: string[];
}

export interface Week {
  id: string;
  number: string;
  title: string;
  goal: string;
  lessons: Lesson[];
  assignment: Assignment;
  review: Review;
  extra?: 'orientation';
  /** Bonus courses open once the main course is complete. Main-course weeks leave this out. */
  track?: 'bonus';
}

export interface Phase {
  name: string;
  weekIds: string[];
}

// ── Rows from Supabase ──────────────────────────────────────────────────────

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'student';
  must_change_password: boolean;
  created_at: string;
}

/** kind 'youtube': url is a YouTube link. 'video' / 'pdf': url is a path in the lesson-media bucket. */
export interface LessonMedia {
  lesson_key: string;
  kind: 'youtube' | 'video' | 'pdf';
  url: string;
  title: string | null;
}

/** A student's answers for one day. Submitting completes the day and unlocks the next. */
export interface Submission {
  id: number;
  user_id: string;
  lesson_key: string;
  answers: string[];
  link: string | null;
  /** Extra links the student added (up to 5). Missing until database update 0002 is applied. */
  links?: string[];
  submitted_at: string;
  feedback: string | null;
  reviewed_at: string | null;
}

export interface Certificate {
  number: string;
  full_name: string;
  /** ISO date, e.g. '2026-11-30'. */
  issued_on: string;
}

export interface StudentSummary {
  id: string;
  email: string;
  full_name: string;
  must_change_password: boolean;
  created_at: string;
  completed: number;
  last_submitted_at: string | null;
  /** Main-course days with feedback. The certificate is issued when this reaches every day. */
  reviewed: number;
}
