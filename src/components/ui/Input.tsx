interface InputProps {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  onChange: (value: string) => void;
}

export default function Input({
  label,
  value,
  placeholder,
  type = "text",
  required = false,
  onChange,
}: InputProps) {
  return (
    <div className="mb-4">
      <label className="mb-2 block">{label}</label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          rounded
          border
          border-gray-600
          bg-gray-800
          p-2
        "
      />
    </div>
  );
}
