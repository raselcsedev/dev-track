
"use client";

interface DateTimePickerProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  min?: string;
  disabled?: boolean;
}

export default function DateTimePicker({
  id,
  label,
  value,
  onChange,
  required = false,
  min,
  disabled = false,
}: DateTimePickerProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-gray-300"
      >
        {label}
      </label>

      <input
        id={id}
        name={id}
        type="datetime-local"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        min={min}
        disabled={disabled}
        className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}
