import React from 'react';

interface LogoProps {
  variant?: 'vertical' | 'horizontal' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const fullLogoWidths = {
  sm: 'w-[74px]',
  md: 'w-[112px]',
  lg: 'w-[184px]',
};

const iconSizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
};

/**
 * Displays the official supplied DELMI Training Institute artwork.
 * The source PNG has generous transparent margins, so the frame crops those
 * margins with CSS while keeping the original logo pixels untouched.
 */
export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
}) => {
  if (variant === 'icon-only') {
    return (
      <div
        className={`relative overflow-hidden shrink-0 ${iconSizes[size]} ${className}`}
        aria-label="DELMI Training Institute"
      >
        <img
          src="/delmi-training-logo.png"
          alt=""
          className="absolute max-w-none select-none"
          style={{ width: '330%', left: '-118%', top: '-46%' }}
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden shrink-0 ${fullLogoWidths[size]} ${className}`}
      style={{ aspectRatio: '738 / 491' }}
    >
      <img
        src="/delmi-training-logo.png"
        alt="DELMI Training Institute"
        className="absolute max-w-none select-none"
        style={{ width: '173.5%', left: '-36.6%', top: '-23.5%' }}
        draggable={false}
      />
    </div>
  );
};

export default Logo;
