import React, { createContext, useCallback, useContext, useState } from 'react';
import { GlobalLoader } from '../ui/GlobalLoader/GlobalLoader';

interface LoadingContextValue {
  show: (text?: string) => void;
  hide: () => void;
  isLoading: boolean;
  loadingText: string;
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loadingCount, setLoadingCount] = useState(0);
  const [loadingText, setLoadingText] = useState('');

  const show = useCallback((text?: string) => {
    setLoadingCount((prev) => prev + 1);
    setLoadingText(text ?? '');
  }, []);

  const hide = useCallback(() => {
    setLoadingCount((prev) => Math.max(0, prev - 1));
  }, []);

  const isLoading = loadingCount > 0;

  const value: LoadingContextValue = {
    show,
    hide,
    isLoading,
    loadingText,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <GlobalLoader visible={isLoading} textContent={loadingText} />
    </LoadingContext.Provider>
  );
}

export function useLoading(): LoadingContextValue {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return ctx;
}
