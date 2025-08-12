import React from "react";

interface Option {
  label: string;
  value: string;
}

interface CheckboxGroupProps {
  label?: string;
  name: string;
  options: Option[];
  selected: string[]; // multiple selected values
  onChange: (selected: string[]) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
}

const CheckBox: React.FC<CheckboxGroupProps> = ({
  label,
  name,
  options,
  selected,
  onChange,
  disabled = false,
  required = false,
  className,
  error,
}) => {
  const toggleValue = (value: string) => {
    if (selected?.includes(value)) {
      onChange(selected?.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

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

      <div className={`flex flex-wrap gap-6 mt-2 ${className}`}>
        {options && options.map((option) => {
          const isSelected = selected && selected?.includes(option.value);

          return (
            <label
              key={option.value}
              className={`flex items-center gap-2 cursor-pointer select-none text-sm ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <input
                type="checkbox"
                name={name}
                value={option.value}
                checked={isSelected}
                disabled={disabled}
                onChange={() => toggleValue(option.value)}
                className="sr-only"
              />
              <span
                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  isSelected ? "border-green-600 bg-green-600" : "border-gray-400 bg-white"
                }`}
              >
                {isSelected && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <span className={"text-black-700 font-semibold"}>
                {option.label}
              </span>
            </label>
          );
        })}
      </div>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default CheckBox;
