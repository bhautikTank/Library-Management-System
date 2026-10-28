import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed top-6 right-6 z-[100] max-w-sm w-[calc(100vw-3rem)] sm:w-96 animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
      <div
        className={`p-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center justify-between gap-3 ${
          isSuccess
            ? 'bg-[#05051B]/95 border-green-500/50 text-green-300 shadow-green-950/40'
            : 'bg-[#05051B]/95 border-red-500/50 text-red-300 shadow-red-950/40'
        }`}
      >
        <div className="flex items-center gap-3">
          {isSuccess ? (
            <CheckCircle2 size={20} className="shrink-0 text-green-400" />
          ) : (
            <AlertTriangle size={20} className="shrink-0 text-red-400" />
          )}
          <span className="text-sm font-semibold leading-snug">{message}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer shrink-0"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;

