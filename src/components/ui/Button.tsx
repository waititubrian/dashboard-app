interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit";
  variant?: "primary" | "danger" | "warning" | "secondary";
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const variants = {
  primary: "bg-blue-600 hover:bg-blue-700",

  danger: "bg-red-600 hover:bg-red-700",

  warning: "bg-yellow-500 hover:bg-yellow-600",

  secondary: "bg-gray-600 hover:bg-gray-700",
};

export default function Button({
  children,
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        rounded
        px-4
        py-2
        text-white
        transition
        disabled:opacity-50
        ${variants[variant]}
      `}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
