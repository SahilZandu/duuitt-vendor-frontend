// src/components/Button.tsx

type Props = {
  label: string;
  onClick?: () => void;
  disabled?: boolean; // ✅ Add this line
  className?: string;
};

const Button = ({ label, onClick, disabled = false, className }: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md w-full ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className || ""}`}
    >
      {label}
    </button>
  );
};

export default Button;
