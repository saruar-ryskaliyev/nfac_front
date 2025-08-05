'use client';

import { useState, useEffect, useCallback } from 'react';
import { attemptService } from '@/services/attempt';
import { Attempt } from '@/types/attempt';
import { useAuth } from '@/context/AuthContext';

interface UseUserAttemptsState {
  attempts: Attempt[];
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  hasData: boolean;
}

interface UseUserAttemptsActions {
  refetch: () => Promise<void>;
  clearError: () => void;
}

interface UseUserAttemptsReturn extends UseUserAttemptsState, UseUserAttemptsActions {
  bestAttempt: Attempt | null;
  latestAttempt: Attempt | null;
  averageScore: number;
  totalAttempts: number;
}

export function useUserAttempts(quizId: number): UseUserAttemptsReturn {
  const [state, setState] = useState<UseUserAttemptsState>({
    attempts: [],
    loading: true,
    error: null,
    isEmpty: true,
    hasData: false,
  });

  const { isAuthenticated } = useAuth();

  const fetchAttempts = useCallback(async () => {
    if (!isAuthenticated || !quizId) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
        attempts: [],
        isEmpty: true,
        hasData: false,
      }));
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const attempts = await attemptService.getUserAttemptsForQuiz(quizId);
      
      // Sort attempts by created date (newest first)
      const sortedAttempts = attempts.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setState(prev => ({
        ...prev,
        attempts: sortedAttempts,
        loading: false,
        isEmpty: sortedAttempts.length === 0,
        hasData: sortedAttempts.length > 0,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch attempts',
        loading: false,
        isEmpty: true,
        hasData: false,
      }));
    }
  }, [quizId, isAuthenticated]);

  const refetch = useCallback(async () => {
    await fetchAttempts();
  }, [fetchAttempts]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchAttempts();
  }, [fetchAttempts]);

  // Computed values
  const bestAttempt = state.attempts.length > 0 
    ? state.attempts.reduce((best, current) => 
        current.score > best.score ? current : best
      ) 
    : null;

  const latestAttempt = state.attempts.length > 0 ? state.attempts[0] : null;

  const averageScore = state.attempts.length > 0 
    ? state.attempts.reduce((sum, attempt) => sum + attempt.score, 0) / state.attempts.length
    : 0;

  const totalAttempts = state.attempts.length;

  return {
    ...state,
    refetch,
    clearError,
    bestAttempt,
    latestAttempt,
    averageScore,
    totalAttempts,
  };
}