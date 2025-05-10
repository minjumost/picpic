import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type: "green" | "red";
  duration?: number;
  triggerkey: number;
}

const TYPE_CLASSES = {
  green: {
    bg: "bg-green",
    border: "border-greenBorder",
  },
  red: {
    bg: "bg-red",
    border: "border-redBorder",
  },
} as const;

const Toast = ({ message, type, duration = 2000, triggerkey }: ToastProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [triggerkey, duration]);

  const { bg, border } = TYPE_CLASSES[type];

  return (
    <div className="fixed left-1/2 bottom-[5%] translate-x-[-50%] z-[9999]">
      <div
        className={`relative w-[360px] h-[54px] flex items-center justify-center 
        ${bg} border-[3px] border-text rounded-lg p-1
        transform transition-all duration-300 ease-out
        ${visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
      >
        <div
          className={`w-full h-full flex items-center justify-center border-[3px] ${border} rounded-sm`}
        >
          <span className="text-yellowBorder text-[20px] text-center">
            {message}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Toast;
