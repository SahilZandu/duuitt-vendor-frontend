import React from "react";
import clsx from "clsx";

interface Props {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  name?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
}

const Input: React.FC<Props> = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  name,
  error,
  disabled = false,
  className = "",
  multiline = false,
  rows = 4,
  required= false,
}) => {
  const baseClass = clsx(
    "w-full px-4 py-2 border rounded-md text-sm transition duration-200",
    {
      "border-gray-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-300": !error,
      "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-200": error,
      "bg-gray-100 cursor-not-allowed": disabled,
    },
    className
  );

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}


      {multiline ? (
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          rows={rows}
          className={baseClass}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={baseClass}
        />
      )}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Input;
