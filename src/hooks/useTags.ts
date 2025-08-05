'use client';

import { useState, useEffect } from 'react';
import { tagService } from '@/services/tags';
import { Tag } from '@/types/quiz';

interface UseTagsState {
  tags: Tag[];
  loading: boolean;
  error: string | null;
}

export function useTags(): UseTagsState {
  const [state, setState] = useState<UseTagsState>({
    tags: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const tags = await tagService.getAllTags();
        setState(prev => ({
          ...prev,
          tags,
          loading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          tags: [],
          error: error instanceof Error ? error.message : 'Failed to fetch tags',
          loading: false,
        }));
      }
    };

    fetchTags();
  }, []);

  return state;
}