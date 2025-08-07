import clsx from "clsx";
import React from "react";

type Variant =
  | "primary"
  | "secondary"
  | "danger"
  | "outline"
  | "success"
  | "soft-success"
  | "outline-success";

type Props = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  variant?: Variant;
  type?: "button" | "submit" | "reset";
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
};

const variantClasses: Record<Variant, string> = {
  primary: "bg-purple-600 hover:bg-purple-700 text-white",
  secondary: "bg-orange-400 hover:bg-orange-500 text-white font-medium",
  danger: "border border-red-600 text-red-700 font-semibold hover:bg-red-100",
  outline: "bg-transparent border border-gray-400 text-gray-700 hover:bg-gray-100",
  success: "bg-green-600 hover:bg-green-700 text-white",
  "soft-success": "bg-green-100 text-green-700",
  "outline-success": "border border-green-500 text-green-600 bg-white hover:bg-green-50",
};

const Button = ({
  label,
  onClick,
  disabled = false,
  loading = false,
  className = "",
  variant = "primary",
  type = "button",
  iconLeft,
  iconRight,
}: Props) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        "px-4 py-2 rounded-[10px] font-medium transition duration-200 text-sm flex items-center justify-center gap-2",
        variantClasses[variant],
        {
          "opacity-50 cursor-not-allowed": disabled || loading,
        },
        className
      )}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      )}

      {iconLeft && <span className="mr-1">{iconLeft}</span>}
      <span>{label}</span>
      {iconRight && <span className="ml-1">{iconRight}</span>}
    </button>
  );
};

export default Button;
