"use client";

import { useEffect } from "react";

interface NotificationProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Notification({
  type,
  message,
  onClose,
  duration = 3000,
}: NotificationProps) {
  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [message, duration, onClose]);

  if (!message) {
    return null;
  }

  const isSuccess = type === "success";

  return (
    <div
      className={`mb-6 flex items-center justify-between rounded-lg border px-4 py-3 ${
        isSuccess
          ? "border-green-500/30 bg-green-500/10 text-green-400"
          : "border-red-500/30 bg-red-500/10 text-red-400"
      }`}
      role="alert"
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{isSuccess ? "✓" : "!"}</span>

        <span>{message}</span>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="ml-4 text-lg font-semibold opacity-70 transition hover:opacity-100"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}
