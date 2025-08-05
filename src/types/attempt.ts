export interface Attempt {
  id: number;
  quiz_id: number;
  user_id: number;
  attempt_number: number;
  score: number;
  started_at: string;
  finished_at: string | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface AttemptResponse {
  message: string;
  data: Attempt;
  detail: Record<string, any> | null;
}

export interface AttemptListResponse {
  message: string;
  data: Attempt[];
  detail: Record<string, any> | null;
}

export interface AnswerResult {
  id: number;
  attempt_id: number;
  question_id: number;
  selected_option_ids: number[] | null;
  text_answer: string | null;
  is_correct: boolean | null;
  submitted_at: string;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface QuizResult {
  attempt_id: number;
  quiz_id: number;
  user_id: number;
  attempt_no: number;
  total_questions: number;
  correct_answers: number;
  total_points: number;
  score_percentage: number;
  answers: AnswerResult[];
}

export interface QuestionResult {
  question_id: number;
  question_text: string;
  question_type: "single" | "text" | "multiple";
  points: number;
  user_answer: string | string[] | null;
  correct_answer: string | string[];
  is_correct: boolean;
  points_earned: number;
}

export interface QuizResultResponse {
  message: string;
  data: QuizResult;
  detail: Record<string, any> | null;
}

export interface UserAnswer {
  id: number;
  attempt_id: number;
  question_id: number;
  selected_option_ids: number[] | null;
  text_answer: string | null;
  is_correct: boolean | null;
  submitted_at: string;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface AttemptDetails {
  id: number;
  quiz_id: number;
  user_id: number;
  attempt_no: number;
  score: number;
  started_at: string;
  finished_at: string | null;
  questions: Array<{
    id: number;
    quiz_id: number;
    question_text: string;
    question_type: 'single' | 'text' | 'multiple';
    points: number;
    options: Array<{
      id: number;
      question_id: number;
      option_text: string;
      is_correct: boolean;
      created_at: string;
      updated_at: string | null;
      deleted_at: string | null;
    }>;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
  }>;
  user_answers: UserAnswer[];
}

export interface AttemptDetailsResponse {
  message: string;
  data: AttemptDetails;
  detail: Record<string, any> | null;
}
