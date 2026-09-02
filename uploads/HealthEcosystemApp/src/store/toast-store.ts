import { create } from 'zustand';

export type ToastTone = 'neutral' | 'success' | 'warning' | 'danger';

export type Toast = {
  id: number;
  title: string;
  message?: string;
  tone: ToastTone;
  durationMs: number;
};

type ToastInput = {
  title: string;
  message?: string;
  tone?: ToastTone;
  durationMs?: number;
};

type ToastState = {
  toasts: Toast[];
  show: (input: ToastInput) => void;
  dismiss: (id: number) => void;
};

let nextToastId = 1;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show: ({ title, message, tone = 'neutral', durationMs = 2800 }) => {
    const id = nextToastId++;
    set((state) => ({ toasts: [...state.toasts.slice(-1), { id, title, message, tone, durationMs }] }));
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

/** Imperative helper so non-component code (stores) can show feedback. */
export const toast = {
  show: (input: ToastInput) => useToastStore.getState().show(input),
  success: (title: string, message?: string) => useToastStore.getState().show({ title, message, tone: 'success' }),
  error: (title: string, message?: string) => useToastStore.getState().show({ title, message, tone: 'danger' }),
};
