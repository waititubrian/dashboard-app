interface SpinnerProps {
  size?: "small" | "medium" | "large";
}

const sizes = {
  small: "h-4 w-4",
  medium: "h-6 w-6",
  large: "h-10 w-10",
};

export default function Spinner({ size = "medium" }: SpinnerProps) {
  return (
    <div
      className={`${sizes[size]} animate-spin rounded-full border-2 border-gray-600 border-t-white`}
      role="status"
      aria-label="Loading"
    />
  );
}
