import React from 'react';

interface LogoProps {
  variant?: 'vertical' | 'horizontal' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ variant = 'horizontal', size = 'md' }) => {
  // Brand colors
  const blueColor = '#1b75d0';
  const redColor = '#be123c';

  // Size mapping
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'h-5',
    md: 'h-6.5',
    lg: 'h-10',
  };

  // Double D Icon SVG
  const IconSVG = (className: string) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer D */}
      <path
        d="M 35,12 L 35,88 L 54,88 C 76,88 88,74 88,50 C 88,26 76,12 54,12 Z"
        stroke={blueColor}
        strokeWidth="9.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner D */}
      <path
        d="M 47,26 L 47,74 L 56,74 C 68,74 74,65 74,50 C 74,35 68,26 56,26 Z"
        stroke={blueColor}
        strokeWidth="8.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // DELMI Text Brand SVG
  const TextSVG = (className: string) => (
    <svg viewBox="0 0 120 28" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* D */}
      <path
        d="M 6,3 L 6,25 L 14,25 C 21,25 24,20 24,14 C 24,8 21,3 14,3 Z"
        stroke={blueColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* E */}
      <path
        d="M 33,4 L 47,4 M 33,14 L 47,14 M 33,24 L 47,24"
        stroke={blueColor}
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* L */}
      <path
        d="M 56,3 L 56,25 L 70,25"
        stroke={blueColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* M */}
      <path
        d="M 78,25 L 78,3 L 88,14 L 98,3 L 98,25"
        stroke={blueColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* I */}
      <path
        d="M 110,9 L 110,25"
        stroke={blueColor}
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Red corner triangle on I */}
      <polygon points="105,3 110,3 110,8" fill={redColor} />
    </svg>
  );

  if (variant === 'icon-only') {
    return IconSVG(iconSizes[size]);
  }

  if (variant === 'vertical') {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        {IconSVG(iconSizes.lg)}
        <div className="flex flex-col items-center gap-1.5 w-full max-w-[200px]">
          {TextSVG(textSizes.lg)}
          <span 
            className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.32em] text-[#1b75d0] leading-none mt-1 font-sans"
            style={{ color: blueColor }}
          >
            Training Institute
          </span>
        </div>
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div className="flex items-center gap-3">
      {IconSVG(iconSizes[size])}
      <div className="flex flex-col items-start leading-none gap-0.5">
        {TextSVG(textSizes[size])}
        <span 
          className="text-[6.5px] sm:text-[7.5px] font-black uppercase tracking-[0.32em] text-[#1b75d0] leading-none font-sans"
          style={{ color: blueColor }}
        >
          Training Institute
        </span>
      </div>
    </div>
  );
};

export default Logo;
