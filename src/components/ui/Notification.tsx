"use client";

interface NotificationProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

export default function Notification({
  type,
  message,
  onClose,
}: NotificationProps) {
  const isSuccess = type === "success";

  return (
    <div
      className={`mb-6 flex items-center justify-between rounded-lg border p-4 ${
        isSuccess
          ? "border-green-700 bg-green-900/30 text-green-300"
          : "border-red-700 bg-red-900/30 text-red-300"
      }`}
    >
      <span>{message}</span>

      <button
        type="button"
        onClick={onClose}
        className="ml-4 text-lg font-bold"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}
