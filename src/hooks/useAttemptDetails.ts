'use client';

import { useState, useCallback } from 'react';
import { attemptService } from '@/services/attempt';
import { AttemptDetails, UserAnswer } from '@/types/attempt';

interface UseAttemptDetailsState {
  details: AttemptDetails | null;
  loading: boolean;
  error: string | null;
}

interface UseAttemptDetailsActions {
  fetchDetails: (attemptId: number) => Promise<boolean>;
  clearDetails: () => void;
  clearError: () => void;
}

interface UseAttemptDetailsReturn extends UseAttemptDetailsState, UseAttemptDetailsActions {
  // Computed properties for better UX
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
  scorePercentage: number;
  timeTaken: string;
  questionResults: Array<{
    question: AttemptDetails['questions'][0];
    userAnswer: UserAnswer | null;
    isCorrect: boolean | null;
    pointsEarned: number;
  }>;
}

export function useAttemptDetails(): UseAttemptDetailsReturn {
  const [state, setState] = useState<UseAttemptDetailsState>({
    details: null,
    loading: false,
    error: null,
  });

  const fetchDetails = useCallback(async (attemptId: number): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const details = await attemptService.getAttemptDetails(attemptId);
      
      setState(prev => ({
        ...prev,
        details,
        loading: false,
      }));
      
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch attempt details',
        loading: false,
      }));
      return false;
    }
  }, []);

  const clearDetails = useCallback(() => {
    setState({
      details: null,
      loading: false,
      error: null,
    });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Computed properties
  const totalQuestions = state.details?.questions.length || 0;
  const answeredQuestions = state.details?.user_answers.length || 0;
  const correctAnswers = state.details?.user_answers.filter(answer => answer.is_correct === true).length || 0;
  const incorrectAnswers = state.details?.user_answers.filter(answer => answer.is_correct === false).length || 0;
  const unansweredQuestions = totalQuestions - answeredQuestions;

  const totalPossiblePoints = state.details?.questions.reduce((sum, q) => sum + q.points, 0) || 0;
  const scorePercentage = totalPossiblePoints > 0 ? Math.round((state.details?.score || 0) / totalPossiblePoints * 100) : 0;

  const timeTaken = (() => {
    if (!state.details?.started_at || !state.details?.finished_at) return 'N/A';
    
    const start = new Date(state.details.started_at);
    const end = new Date(state.details.finished_at);
    const diffMs = end.getTime() - start.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffSeconds / 60);
    const seconds = diffSeconds % 60;
    
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  })();

  const questionResults = state.details ? state.details.questions.map(question => {
    const userAnswer = state.details!.user_answers.find(answer => answer.question_id === question.id) || null;
    const pointsEarned = userAnswer?.is_correct === true ? question.points : 0;
    
    return {
      question,
      userAnswer,
      isCorrect: userAnswer?.is_correct || null,
      pointsEarned,
    };
  }) : [];

  return {
    ...state,
    fetchDetails,
    clearDetails,
    clearError,
    totalQuestions,
    answeredQuestions,
    correctAnswers,
    incorrectAnswers,
    unansweredQuestions,
    scorePercentage,
    timeTaken,
    questionResults,
  };
}