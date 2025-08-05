'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  searchQuery: string;
  selectedTag: string | null;
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string | null) => void;
  clearSearch: () => void;
  clearFilters: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTag(null);
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        selectedTag,
        setSearchQuery,
        setSelectedTag,
        clearSearch,
        clearFilters,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}