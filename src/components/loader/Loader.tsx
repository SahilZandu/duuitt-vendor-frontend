import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <span className="loader relative"></span>
      <style>{`
        .loader {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: inline-block;
          border-top: 4px solid #FFF;
          border-right: 4px solid transparent;
          box-sizing: border-box;
          position: relative;  /* Added */
          animation: rotation 1s linear infinite;
        }
        .loader::after {
          content: '';
          box-sizing: border-box;
          position: absolute;
          left: 0;
          top: 0;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border-left: 4px solid #fcb315;
          border-bottom: 4px solid transparent;
          animation: rotation 0.5s linear infinite reverse;
        }
        @keyframes rotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
