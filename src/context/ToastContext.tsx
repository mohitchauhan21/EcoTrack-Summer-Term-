import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  exiting?: boolean;
}

interface ToastContextType {
  toast: (message: string, type: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    // Mark as exiting first for slide-out animation, then remove
    setToasts((prev) => prev.map((t) => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const addToast = useCallback((message: string, type: ToastType) => {
    // Deduplicate: don't add if same message+type is already visible
    setToasts((prev) => {
      const alreadyExists = prev.some((t) => t.message === message && t.type === type && !t.exiting);
      if (alreadyExists) return prev;
      const id = Math.random().toString(36).substr(2, 9);
      setTimeout(() => removeToast(id), 3000);
      return [...prev, { id, message, type }];
    });
  }, [removeToast]);

  const success = useCallback((message: string) => addToast(message, 'success'), [addToast]);
  const error = useCallback((message: string) => addToast(message, 'error'), [addToast]);
  const info = useCallback((message: string) => addToast(message, 'info'), [addToast]);

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, info }}>
      {children}
      {/* Toast container – top-right */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              animation: t.exiting
                ? 'toastSlideOut 0.3s ease-in forwards'
                : 'toastSlideIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
            }}
            className={`
              pointer-events-auto
              flex items-start gap-3 pl-4 pr-3 py-3.5
              rounded-2xl border shadow-2xl min-w-[280px] max-w-[380px]
              dark:bg-zinc-900 bg-white
              ${t.type === 'success' ? 'border-emerald-500/25 border-l-[3px] border-l-emerald-500' : ''}
              ${t.type === 'error'   ? 'border-red-500/25 border-l-[3px] border-l-red-500'       : ''}
              ${t.type === 'info'    ? 'border-blue-500/25 border-l-[3px] border-l-blue-400'     : ''}
            `}
          >
            {/* Icon */}
            <span className="mt-0.5 shrink-0">
              {t.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
              {t.type === 'error'   && <AlertCircle className="w-5 h-5 text-red-500" />}
              {t.type === 'info'    && <Info className="w-5 h-5 text-blue-400" />}
            </span>

            {/* Message */}
            <span className="flex-1 text-sm font-medium leading-snug dark:text-zinc-100 text-gray-900">
              {t.message}
            </span>

            {/* Dismiss */}
            <button
              onClick={() => removeToast(t.id)}
              aria-label="Dismiss notification"
              className="shrink-0 mt-0.5 cursor-pointer dark:text-zinc-500 text-gray-400 hover:dark:text-zinc-300 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Keyframe animations injected once as a style tag */}
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(110%) scale(0.95); }
          to   { opacity: 1; transform: translateX(0)   scale(1);    }
        }
        @keyframes toastSlideOut {
          from { opacity: 1; transform: translateX(0)   scale(1);    }
          to   { opacity: 0; transform: translateX(110%) scale(0.95); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
