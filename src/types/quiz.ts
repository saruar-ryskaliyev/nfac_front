export interface Tag {
  id: number;
  name: string;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  creator_id: number;
  is_public: boolean;
  tags: Tag[];
  questions?: Question[]; // Optional for list view, present in detail view
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface Option {
  id: number;
  question_id: number;
  option_text: string;
  is_correct: boolean;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface Question {
  id: number;
  quiz_id: number;
  question_text: string;
  question_type: 'single' | 'text' | 'multiple';
  points: number;
  options: Option[];
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface QuizInCreate {
  title: string;
  description: string;
  is_public?: boolean;
  tag_names: string[];
  questions: QuestionInCreate[];
}

export interface QuestionInCreate {
  question_text: string;
  question_type: 'single' | 'text' | 'multiple';
  points: number;
  options: OptionInCreate[];
}

export interface OptionInCreate {
  option_text: string;
  is_correct: boolean;
}

export interface QuizInUpdate {
  title?: string;
  description?: string;
  is_public?: boolean;
  tag_names?: string[];
  questions?: QuestionInCreate[];
}

export interface QuizResponse {
  message: string;
  data: Quiz;
  detail: Record<string, any>;
}

export interface QuizPaginatedResponse {
  message: string;
  data: {
    data: Quiz[];
    meta: {
      total: number;
      skip: number;
      limit: number;
      has_next: boolean;
      has_previous: boolean;
      total_pages: number;
      current_page: number;
    };
  };
  detail: Record<string, any> | null;
}

export interface QuizSearchParams {
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
  skip?: number;
}

export interface ErrorResponse {
  app_exception: string;
  context: Record<string, unknown>;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}