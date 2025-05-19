interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  className = "",
}) => {
  return (
    <div className="flex items-center justify-center">
      <button
        disabled={disabled}
        onClick={onClick}
        className={`
        ${className}
          w-full py-3 rounded-lg font-semibold text-lg
          ${
            disabled
              ? "bg-gray-300 text-white cursor-not-allowed"
              : "bg-main1 text-white cursor-pointer"
          }
          
        `}
      >
        {label}
      </button>
    </div>
  );
};

export default Button;
