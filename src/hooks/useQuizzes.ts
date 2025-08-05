'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { quizService } from '@/services/quiz';
import { Quiz, QuizSearchParams } from '@/types/quiz';

interface UseQuizzesState {
  quizzes: Quiz[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface UseQuizzesActions {
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setTag: (tag: string | undefined) => void;
  setSearchQuery: (query: string) => void;
  refetch: () => Promise<void>;
}

interface UseQuizzesReturn extends UseQuizzesState, UseQuizzesActions {}

export function useQuizzes(initialParams?: QuizSearchParams, externalSearchQuery?: string): UseQuizzesReturn {
  const [state, setState] = useState<UseQuizzesState>({
    quizzes: [],
    loading: true,
    error: null,
    total: 0,
    page: initialParams?.page || 1,
    limit: initialParams?.limit || 20,
    pages: 0,
  });

  const [searchParams, setSearchParams] = useState<QuizSearchParams>({
    page: initialParams?.page || 1,
    limit: initialParams?.limit || 20,
    tag: initialParams?.tag,
  });

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(externalSearchQuery || '');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchQuizzes = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Use search endpoint if there's a search query, otherwise use getAllQuizzes
      const data = debouncedSearchQuery.trim() 
        ? await quizService.searchQuizzes({ ...searchParams, search: debouncedSearchQuery })
        : await quizService.getAllQuizzes(searchParams);
      
      setState(prev => ({
        ...prev,
        quizzes: data.items,
        total: data.total,
        page: data.page,
        limit: data.limit,
        pages: data.pages,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        quizzes: [],
        error: error instanceof Error ? error.message : 'Failed to fetch quizzes',
        loading: false,
      }));
    }
  }, [searchParams, debouncedSearchQuery]);

  // Handle external search query changes with debounce
  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      debounceRef.current = setTimeout(() => {
        setDebouncedSearchQuery(externalSearchQuery);
        setSearchParams(prev => ({ ...prev, page: 1 })); // Reset to first page on search
      }, 500); // 500ms debounce delay
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [externalSearchQuery]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const setPage = useCallback((page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setSearchParams(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  const setTag = useCallback((tag: string | undefined) => {
    setSearchParams(prev => ({ ...prev, tag, page: 1 }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      setDebouncedSearchQuery(query);
      setSearchParams(prev => ({ ...prev, page: 1 })); // Reset to first page on search
    }, 500); // 500ms debounce delay
  }, []);

  const refetch = useCallback(async () => {
    await fetchQuizzes();
  }, [fetchQuizzes]);

  return {
    ...state,
    setPage,
    setLimit,
    setTag,
    setSearchQuery,
    refetch,
  };
}