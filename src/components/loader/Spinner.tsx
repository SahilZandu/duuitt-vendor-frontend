import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
