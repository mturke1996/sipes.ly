import React from "react";

interface SipesLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  textColor?: "red" | "white" | "black";
  vertical?: boolean;
}

export default function SipesLogo({
  size = "md",
  showText = true,
  className = "",
  textColor = "red",
  vertical = false,
}: SipesLogoProps) {
  const sizeClasses = {
    sm: "w-12 h-8",
    md: "w-16 h-10",
    lg: "w-20 h-12",
    xl: "w-32 h-20 sm:w-48 sm:h-32 md:w-56 md:h-36",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg",
    xl: "text-lg sm:text-2xl md:text-3xl lg:text-4xl",
  };

  const symbolSizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-6 h-6",
  };

  return (
    <div
      className={`flex ${
        vertical ? "flex-col" : "flex-row"
      } items-center gap-2 sm:gap-3 ${className}`}
    >
      {/* SIPES Logo - Real Image */}
      <div className="relative">
        <div className={`${sizeClasses[size]} relative overflow-hidden`}>
          <img
            src="/sipes-logo.png"
            alt="SIPES Logo"
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>
      </div>

      {showText && (
        <div
          className={`flex ${vertical ? "flex-col" : "flex-col"} items-center`}
        >
          <div
            className={`font-black ${textSizeClasses[size]} mb-0.5 ${
              textColor === "red"
                ? "text-red-600"
                : textColor === "white"
                ? "text-white"
                : "text-black"
            }`}
          >
            سايبس
          </div>
          <div
            className={`text-xs sm:text-sm md:text-base lg:text-lg font-medium ${
              textColor === "red"
                ? "text-gray-600"
                : textColor === "white"
                ? "text-gray-400"
                : "text-gray-600"
            }`}
          >
            ليبيا
          </div>
        </div>
      )}
    </div>
  );
}
