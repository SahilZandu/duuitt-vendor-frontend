import React from "react";

interface Props {
  label: string;
  onClick: () => void;
}

const Button = ({ label, onClick }: Props) => (
  <button
    onClick={onClick}
    className="w-full bg-purple-600 text-white py-2 rounded font-medium hover:bg-purple-700"
  >
    {label}
  </button>
);

export default Button;
