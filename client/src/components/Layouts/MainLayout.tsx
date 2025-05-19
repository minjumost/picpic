import React from "react";
import { useNavigate } from "react-router";
import logo from "../../assets/logo.png";

interface MainLayoutProps {
  title?: string;
  description?: string[];
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  title,
  description,
  children,
  footer,
}) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="flex flex-col justify-between w-full h-full p-4 gap-8 relative overflow-hidden">
      {/* top: logo */}
      <div>
        <img
          src={logo}
          className="w-18 cursor-pointer"
          alt="logo"
          onClick={handleLogoClick}
        />
      </div>

      {/* body: title + description + optional content */}
      <div className="flex flex-col gap-8 flex-1">
        <div className="flex flex-col gap-2">
          {title && (
            <h2 className="text-[22px] font-bold text-gray-800">{title}</h2>
          )}

          {description &&
            description.map((line, idx) => (
              <p key={idx} className="text-[16px] font-medium text-gray-600">
                {line}
              </p>
            ))}
        </div>
        {children}
      </div>

      {/* footer: custom content */}
      {footer && <div>{footer}</div>}
    </div>
  );
};

export default MainLayout;
