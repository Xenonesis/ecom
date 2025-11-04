"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon" | "text";
  size?: number;
}

export function Logo({ className = "", variant = "full", size = 40 }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Determine which theme to use
  const currentTheme = mounted ? resolvedTheme : "light";
  const isDark = currentTheme === "dark";

  // Color scheme based on theme
  const primaryColor = isDark ? "#8B5CF6" : "#7C3AED"; // Purple
  const secondaryColor = isDark ? "#EC4899" : "#DB2777"; // Pink
  const accentColor = isDark ? "#3B82F6" : "#2563EB"; // Blue
  const textColor = isDark ? "#F9FAFB" : "#111827";

  if (variant === "icon") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="50%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor={accentColor} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Shopping bag base */}
        <path
          d="M25 35 L25 85 C25 90 28 93 33 93 L67 93 C72 93 75 90 75 85 L75 35"
          stroke="url(#logoGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Shopping bag handles */}
        <path
          d="M35 35 C35 25 40 15 50 15 C60 15 65 25 65 35"
          stroke="url(#logoGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Hub connection dots - forming a network */}
        <circle cx="50" cy="55" r="4" fill={primaryColor} filter="url(#glow)" />
        <circle cx="38" cy="65" r="3" fill={secondaryColor} filter="url(#glow)" />
        <circle cx="62" cy="65" r="3" fill={accentColor} filter="url(#glow)" />
        <circle cx="50" cy="75" r="3" fill={primaryColor} filter="url(#glow)" />
        
        {/* Connection lines */}
        <line x1="50" y1="55" x2="38" y2="65" stroke={primaryColor} strokeWidth="2" opacity="0.5" />
        <line x1="50" y1="55" x2="62" y2="65" stroke={primaryColor} strokeWidth="2" opacity="0.5" />
        <line x1="38" y1="65" x2="50" y2="75" stroke={secondaryColor} strokeWidth="2" opacity="0.5" />
        <line x1="62" y1="65" x2="50" y2="75" stroke={accentColor} strokeWidth="2" opacity="0.5" />
      </svg>
    );
  }

  if (variant === "text") {
    return (
      <div className={`flex items-center font-bold ${className}`}>
        <span 
          className="text-2xl"
          style={{
            backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor}, ${accentColor})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ShopHub
        </span>
      </div>
    );
  }

  // Full logo with icon and text
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGradientFull" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="50%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor={accentColor} />
          </linearGradient>
          <filter id="glowFull">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Shopping bag base */}
        <path
          d="M25 35 L25 85 C25 90 28 93 33 93 L67 93 C72 93 75 90 75 85 L75 35"
          stroke="url(#logoGradientFull)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Shopping bag handles */}
        <path
          d="M35 35 C35 25 40 15 50 15 C60 15 65 25 65 35"
          stroke="url(#logoGradientFull)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Hub connection dots */}
        <circle cx="50" cy="55" r="4" fill={primaryColor} filter="url(#glowFull)" />
        <circle cx="38" cy="65" r="3" fill={secondaryColor} filter="url(#glowFull)" />
        <circle cx="62" cy="65" r="3" fill={accentColor} filter="url(#glowFull)" />
        <circle cx="50" cy="75" r="3" fill={primaryColor} filter="url(#glowFull)" />
        
        {/* Connection lines */}
        <line x1="50" y1="55" x2="38" y2="65" stroke={primaryColor} strokeWidth="2" opacity="0.5" />
        <line x1="50" y1="55" x2="62" y2="65" stroke={primaryColor} strokeWidth="2" opacity="0.5" />
        <line x1="38" y1="65" x2="50" y2="75" stroke={secondaryColor} strokeWidth="2" opacity="0.5" />
        <line x1="62" y1="65" x2="50" y2="75" stroke={accentColor} strokeWidth="2" opacity="0.5" />
      </svg>
      
      <span 
        className="text-2xl font-bold"
        style={{
          backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor}, ${accentColor})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        ShopHub
      </span>
    </div>
  );
}
