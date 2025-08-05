import { api } from "@/lib/axios";
import {
  AnswerSubmit,
  Answer,
  AnswerResponse,
  QuizResultsResponse,
} from "@/types/answer";

export const answerService = {
  /**
   * Submit answers for questions within a specific attempt
   * POST /api/v1/answers/attempts/{attempt_id}/answers
   */
  async submitAnswersToAttempt(attemptId: number, answers: AnswerSubmit[]): Promise<Answer[]> {
    const response = await api.post<AnswerResponse>(
      `/api/v1/answers/attempts/${attemptId}/answers`,
      answers
    );
    // Response data could be single Answer or Answer array
    return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
  },

  /**
   * Get results for a quiz
   * GET /api/v1/answers/results/{quiz_id}
   */
  async getQuizResults(quizId: number): Promise<QuizResultsResponse['data']> {
    const response = await api.get<QuizResultsResponse>(`/api/v1/answers/results/${quizId}`);
    return response.data.data;
  },

  /**
   * Get an answer by ID
   * GET /api/v1/answers/{answer_id}
   */
  async getAnswerById(answerId: number): Promise<Answer> {
    const response = await api.get<AnswerResponse>(`/api/v1/answers/${answerId}`);
    return Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
  },
};