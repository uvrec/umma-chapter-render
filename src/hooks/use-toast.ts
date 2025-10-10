import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const DEFAULT_DURATION = 4000; // ms

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  /** Персональний таймаут; Infinity або 0 — не автозакривати */
  duration?: number;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

type ActionType = typeof actionTypes;
type Action =
  | { type: ActionType["ADD_TOAST"]; toast: ToasterToast }
  | { type: ActionType["UPDATE_TOAST"]; toast: Partial<ToasterToast> & { id: string } }
  | { type: ActionType["DISMISS_TOAST"]; toastId?: ToasterToast["id"] }
  | { type: ActionType["REMOVE_TOAST"]; toastId?: ToasterToast["id"] };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

function genId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}

function clearTimeoutById(id: string) {
  const t = toastTimeouts.get(id);
  if (t) {
    clearTimeout(t);
    toastTimeouts.delete(id);
  }
}

function addToRemoveQueue(toast: ToasterToast) {
  const { id } = toast;
  const duration = typeof toast.duration === "number" ? toast.duration : DEFAULT_DURATION;

  // не ставимо таймер, якщо Infinity/0 або вже стоїть
  if (!duration || duration === Infinity || toastTimeouts.has(id)) return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(id);
    dispatch({ type: "REMOVE_TOAST", toastId: id });
  }, duration);

  toastTimeouts.set(id, timeout);
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST": {
      const next = [action.toast, ...state.toasts].slice(0, TOAST_LIMIT);
      // налаштовуємо авто-видалення для нового першого елемента
      addToRemoveQueue(action.toast);
      // якщо зрізали «зайвий» тост — прибираємо його таймер
      if (state.toasts.length >= TOAST_LIMIT) {
        const removed = state.toasts[state.toasts.length - 1];
        if (removed) clearTimeoutById(removed.id);
      }
      return { ...state, toasts: next };
    }

    case "UPDATE_TOAST": {
      const next = state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t));
      // якщо duration змінено — перевиставимо таймер
      const updated = next.find((t) => t.id === action.toast.id);
      if (updated) {
        clearTimeoutById(updated.id);
        addToRemoveQueue(updated);
      }
      return { ...state, toasts: next };
    }

    case "DISMISS_TOAST": {
      const ids = action.toastId ? [action.toastId] : state.toasts.map((t) => t.id);
      const next = state.toasts.map((t) => (ids.includes(t.id) ? { ...t, open: false } : t));
      // ставимо видалення після анімації (якщо не було таймера)
      ids.forEach((id) => {
        const t = next.find((x) => x.id === id);
        if (t) addToRemoveQueue(t);
      });
      return { ...state, toasts: next };
    }

    case "REMOVE_TOAST": {
      if (action.toastId === undefined) {
        // прибрати всі
        state.toasts.forEach((t) => clearTimeoutById(t.id));
        return { ...state, toasts: [] };
      }
      clearTimeoutById(action.toastId);
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.toastId) };
    }
  }
};

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((l) => l(memoryState));
}

type Toast = Omit<ToasterToast, "id" | "open" | "onOpenChange">;

function baseToast(props: Toast) {
  const id = genId();

  const update = (patch: Partial<ToasterToast>) => dispatch({ type: "UPDATE_TOAST", toast: { ...patch, id } });

  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return { id, update, dismiss };
}

// sugar-хелпери
const toast = Object.assign(baseToast, {
  success: (props: Toast) => baseToast({ ...props, variant: "success" as any }),
  error: (props: Toast) => baseToast({ ...props, variant: "destructive" as any }),
  info: (props: Toast) => baseToast({ ...props, variant: "default" as any }),
});

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const i = listeners.indexOf(setState);
      if (i > -1) listeners.splice(i, 1);
    };
    // ❗ жодних залежностей — підписка має бути одноразова
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };
