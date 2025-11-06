import { useState, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

type TooltipPosition = "top" | "bottom" | "left" | "right";

type TooltipProps = {
  text: string | ReactNode;
  children: ReactNode;
  position?: TooltipPosition;
};

const Tooltip = ({ text, children, position = "top" }: TooltipProps) => {
  const [visible, setVisible] = useState(false);

  // store DOMRect from getBoundingClientRect()
  const [coords, setCoords] = useState<DOMRect | null>(null);

  // Ref specifically typed for a div element
  const ref = useRef<HTMLDivElement | null>(null);

  const showTooltip = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords(rect);
    }
    setVisible(true);
  };

  const hideTooltip = () => {
    setVisible(false);
  };

  // Tooltip element (rendered via portal)
  const tooltipElement = visible && coords && (
    <div
      className={`absolute z-[9999] px-2 py-1 text-sm text-white bg-gray-800 rounded-lg shadow-lg whitespace-nowrap pointer-events-none ${
        position === "top"
          ? "bottom-full mb-2 left-1/2 transform -translate-x-1/2"
          : position === "bottom"
          ? "top-full mt-2 left-1/2 transform -translate-x-1/2"
          : position === "left"
          ? "right-full  mr-5 top-1/2 transform -translate-y-1/2"
          : "left-full  ml-5 top-1/2 transform -translate-y-1/2"
      }`}
      style={
        {
          position: "fixed",
          top:
            position === "top"
              ? coords.top - 8
              : position === "bottom"
              ? coords.bottom + 8
              : coords.top + coords.height / 2,
          left:
            position === "left"
              ? coords.left - 8
              : position === "right"
              ? coords.right + 8
              : coords.left + coords.width / 2,
          transform:
            position === "top" || position === "bottom"
              ? "translateX(-50%)"
              : "translateY(-50%)",
        } 
      }
    >
      {text}
    </div>
  );

  return (
    <div
      ref={ref}
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {visible && tooltipElement && createPortal(tooltipElement, document.body)}
    </div>
  );
};

export default Tooltip;
