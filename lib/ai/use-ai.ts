"use client";

import { useState, useCallback } from "react";
import type { AIResultUnion } from "./types";

type UseAIState = {
  result: AIResultUnion | null;
  loading: boolean;
  error: string | null;
};

export function useAI() {
  const [state, setState] = useState<UseAIState>({
    result: null,
    loading: false,
    error: null,
  });

  const run = useCallback(async <T extends AIResultUnion>(
    fn: () => Promise<T>
  ) => {
    setState({ result: null, loading: true, error: null });
    try {
      const result = await fn();
      setState({ result, loading: false, error: null });
      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "AI request failed. Please try again.";
      setState({ result: null, loading: false, error: message });
      return null;
    }
  }, []);

  const clear = useCallback(() => {
    setState({ result: null, loading: false, error: null });
  }, []);

  return { ...state, run, clear };
}
