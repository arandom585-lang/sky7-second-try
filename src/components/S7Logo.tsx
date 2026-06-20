import React from 'react';

interface S7LogoProps {
  className?: string;
  iconOnly?: boolean;
  variant?: 'light' | 'dark' | 'gold';
}

export const S7Logo: React.FC<S7LogoProps> = ({ 
  className = 'h-8', 
  iconOnly = false,
  variant = 'light' 
}) => {
  const navyColor = '#0A1B33';
  const goldColor = '#D4AF37';
  
  // Decide 'S' color
  const sColor = variant === 'dark' ? navyColor : '#FFFFFF';
  const textColor = variant === 'dark' ? navyColor : '#FFFFFF';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`} id="s7-logo-container">
      {/* High-Fidelity Italic S7 Brandmark */}
      <div className="relative h-full flex items-center justify-center aspect-[1.12] flex-shrink-0" id="s7-logo-graphic">
        <svg
          viewBox="0 0 90 76"
          className="h-full w-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(4, 3) skewX(-14)">
            {/* Elegant stylized S with premium stroke spacing */}
            <path
              d="M 38 15 C 26 15, 19 21, 19 30 C 19 40, 39 41, 39 50 C 39 57, 31 61, 22 61 C 13 61, 8 57, 8 50"
              stroke={sColor}
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Golden Sleek Italicized 7 */}
            <path
              d="M 44 15 L 72 15 L 52 61"
              stroke={goldColor}
              strokeWidth="11.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>
      
      {!iconOnly && (
        <div className="flex flex-col justify-center leading-none" id="s7-logo-text">
          <span 
            className="font-black tracking-[0.25em] font-sans text-xs sm:text-sm lg:text-base uppercase"
            style={{ color: textColor }}
          >
            SKY <span style={{ color: goldColor }}>SEVEN</span>
          </span>
          <span 
            className="tracking-[0.45em] font-mono uppercase text-[7.5px] sm:text-[9px] lg:text-[10px]"
            style={{ color: '#94a3b8' }}
          >
            Ecosystem
          </span>
        </div>
      )}
    </div>
  );
};
