import React from "react";

interface Option {
  label: string;
  value: string;
}

interface RadioGroupProps {
  label: string;
  name: string;
  options: Option[];
  selected: string;
  onChange: (value: string) => void;
  disabled:boolean;
}

const RadioButton: React.FC<RadioGroupProps> = ({
  label,
  name,
  options,
  selected,
  onChange,
  disabled,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-6 mt-2">
        {options.map((option) => {
          const isSelected = selected === option.value;

          return (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer select-none text-sm"
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                disabled={disabled}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? "border-green-600" : "border-gray-400"
                }`}
              >
                {isSelected && <span className="w-3 h-3 bg-green-600 rounded-full" />}
              </span>
              <span className={isSelected ? "text-green-700 font-medium" : "text-gray-700"}>
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default RadioButton;
