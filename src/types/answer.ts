export interface AnswerSubmit {
  question_id: number;
  text_answer?: string;
  selected_option_ids?: number[];
}

export interface Answer {
  id: number;
  attempt_id: number;
  question_id: number;
  text_answer: string | null;
  selected_option_ids: number[];
  is_correct: boolean;
  points_earned: number;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface AnswerResponse {
  message: string;
  data: Answer | Answer[];
  detail: Record<string, any> | null;
}

export interface QuizResultsResponse {
  message: string;
  data: {
    quiz_id: number;
    total_attempts: number;
    best_score: number;
    latest_attempt: {
      attempt_id: number;
      score: number;
      percentage: number;
      completed_at: string;
    } | null;
    attempts_history: Array<{
      attempt_id: number;
      attempt_number: number;
      score: number;
      percentage: number;
      completed_at: string;
    }>;
  };
  detail: Record<string, any> | null;
}