import { useState } from "react";

interface SwitcherProps {
  initial?: boolean;
  onClick?: (value: boolean) => void;
  disabled?: boolean;
  disabledMessage?: string;
}

const Switcher: React.FC<SwitcherProps> = ({
  initial = false,
  onClick,
  disabled = false,
  disabledMessage = "",
}) => {
  const [isOn, setIsOn] = useState<boolean>(initial);

  const toggleSwitch = () => {
    if (disabled) {
      if (disabledMessage) {
        alert(disabledMessage);
      }
      return;
    }

    const newValue = !isOn;
    setIsOn(newValue);
    if (onClick) {
      onClick(newValue);
    }
  };

  return (
    <div
      onClick={toggleSwitch}
      style={{
        width: "50px",
        height: "25px",
        borderRadius: "25px",
        backgroundColor: isOn ? "#4caf50" : "#ccc",
        position: "relative",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background-color 0.3s ease",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: "#fff",
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          left: isOn ? "27px" : "3px",
          transition: "left 0.3s ease",
        }}
      />
    </div>
  );
};

export default Switcher;
