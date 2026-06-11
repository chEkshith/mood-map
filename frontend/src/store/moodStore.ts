import { create } from 'zustand';
import type { APIResponse } from '../types';

interface MoodState {
  /** Latest API response, if any. */
  response: APIResponse | null;
  /** Whether a request is in flight. */
  loading: boolean;
  /** Last error message, if any. */
  error: string | null;

  setResponse: (response: APIResponse) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useMoodStore = create<MoodState>((set) => ({
  response: null,
  loading: false,
  error: null,

  setResponse: (response) => set({ response, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  reset: () => set({ response: null, loading: false, error: null }),
}));
