import React from "react";
import clsx from "clsx";

interface Option {
  label: string;
  value: string;
}

interface Props {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  options: Option[];
  required?: boolean;
  placeholder?: string; // for default disabled option
}

const Dropdown: React.FC<Props> = ({
  label,
  value,
  onChange,
  name,
  error,
  disabled = false,
  className = "",
  options,
  required = false,
  placeholder = "Select an option",
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

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={baseClass}
        required={required}
      >
        <option value="" disabled className="text-gray-800">
          {placeholder}
        </option>
        {options && options?.length > 0 && options?.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Dropdown;
