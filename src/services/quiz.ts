import { api } from "@/lib/axios";
import {
  Quiz,
  QuizInCreate,
  QuizInUpdate,
  QuizResponse,
  QuizPaginatedResponse,
  QuizSearchParams,
  LeaderboardData,
  LeaderboardResponse,
  QuizGenerateRequest,
} from "@/types/quiz";

export const quizService = {
  async createQuiz(quizData: QuizInCreate): Promise<Quiz> {
    const response = await api.post<QuizResponse>("/api/v1/quizzes/", quizData);
    return response.data.data;
  },

  async getAllQuizzes(params?: QuizSearchParams): Promise<{
    items: Quiz[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const response = await api.get<QuizPaginatedResponse>("/api/v1/quizzes/", {
      params,
    });
    return {
      items: response.data.data.data,
      total: response.data.data.meta.total,
      page: response.data.data.meta.current_page,
      limit: response.data.data.meta.limit,
      pages: response.data.data.meta.total_pages,
    };
  },

  async searchQuizzes(params?: QuizSearchParams): Promise<{
    items: Quiz[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const response = await api.get<QuizPaginatedResponse>(
      "/api/v1/quizzes/search",
      {
        params,
      }
    );
    return {
      items: response.data.data.data,
      total: response.data.data.meta.total,
      page: response.data.data.meta.current_page,
      limit: response.data.data.meta.limit,
      pages: response.data.data.meta.total_pages,
    };
  },

  async getQuizById(quizId: number): Promise<Quiz> {
    const response = await api.get<QuizResponse>(`/api/v1/quizzes/${quizId}`);
    return response.data.data;
  },

  async updateQuiz(quizId: number, quizData: QuizInUpdate): Promise<Quiz> {
    const response = await api.put<QuizResponse>(
      `/api/v1/quizzes/${quizId}`,
      quizData
    );
    return response.data.data;
  },

  async deleteQuiz(quizId: number): Promise<void> {
    await api.delete(`/api/v1/quizzes/${quizId}`);
  },

  async getLeaderboard(quizId: number): Promise<LeaderboardData> {
    const response = await api.get<LeaderboardResponse>(`/api/v1/quizzes/${quizId}/leaderboard`);
    return response.data.data;
  },

  async generateQuiz(generateData: QuizGenerateRequest): Promise<Quiz> {
    const response = await api.post<QuizResponse>("/api/v1/quizzes/generate", generateData);
    return response.data.data;
  },
};
