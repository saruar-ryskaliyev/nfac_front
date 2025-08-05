import { api } from "@/lib/axios";
import {
  Attempt,
  AttemptResponse,
  AttemptListResponse,
  QuizResult,
  QuizResultResponse,
  AttemptDetails,
  AttemptDetailsResponse,
} from "@/types/attempt";

export const attemptService = {
  /**
   * Start a new quiz attempt
   * POST /api/v1/quizzes/{quiz_id}/start
   */
  async startQuizAttempt(quizId: number): Promise<Attempt> {
    const response = await api.post<AttemptResponse>(`/api/v1/quizzes/${quizId}/start`);
    return response.data.data;
  },

  /**
   * Submit and finish a quiz attempt
   * POST /api/v1/attempts/{attempt_id}/submit
   */
  async submitAttempt(attemptId: number): Promise<QuizResult> {
    const response = await api.post<QuizResultResponse>(
      `/api/v1/attempts/${attemptId}/submit`,
      {}
    );
    return response.data.data;
  },

  /**
   * Get quiz attempt details by ID
   * GET /api/v1/attempts/{attempt_id}
   */
  async getAttemptById(attemptId: number): Promise<Attempt> {
    const response = await api.get<AttemptResponse>(`/api/v1/attempts/${attemptId}`);
    return response.data.data;
  },

  /**
   * Get all user attempts for a specific quiz
   * GET /api/v1/quizzes/{quiz_id}/attempts
   */
  async getUserAttemptsForQuiz(quizId: number): Promise<Attempt[]> {
    const response = await api.get<AttemptListResponse>(`/api/v1/quizzes/${quizId}/attempts`);
    return response.data.data;
  },

  /**
   * Get all attempts by the current user
   * GET /api/v1/attempts
   */
  async getAllUserAttempts(): Promise<Attempt[]> {
    const response = await api.get<AttemptListResponse>('/api/v1/attempts');
    return response.data.data;
  },

  /**
   * Get detailed attempt information with questions and user answers
   * GET /api/v1/attempts/{attempt_id}/details
   */
  async getAttemptDetails(attemptId: number): Promise<AttemptDetails> {
    const response = await api.get<AttemptDetailsResponse>(`/api/v1/attempts/${attemptId}/details`);
    return response.data.data;
  },
};