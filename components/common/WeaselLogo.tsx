/**
 * WeaselLogo Component
 * 
 * A cute, surprised-looking weasel mascot for the Compliance Monitor app.
 * The weasel's expression conveys vigilance and attention to detail.
 */

interface WeaselLogoProps {
  className?: string;
  size?: number;
}

export function WeaselLogo({ className = '', size = 40 }: WeaselLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Weasel mascot"
    >
      {/* Weasel Body - elongated oval */}
      <ellipse cx="50" cy="60" rx="20" ry="28" fill="#8B7355" />
      
      {/* Belly patch - lighter color */}
      <ellipse cx="50" cy="65" rx="12" ry="18" fill="#D4C4B0" />
      
      {/* Head - circle */}
      <circle cx="50" cy="35" r="18" fill="#8B7355" />
      
      {/* Face patch - lighter */}
      <ellipse cx="50" cy="38" rx="13" ry="11" fill="#D4C4B0" />
      
      {/* Ears - small rounded triangles */}
      <ellipse cx="38" cy="22" rx="5" ry="7" fill="#8B7355" />
      <ellipse cx="62" cy="22" rx="5" ry="7" fill="#8B7355" />
      
      {/* Inner ears - pink */}
      <ellipse cx="38" cy="24" rx="3" ry="4" fill="#FFB6C1" />
      <ellipse cx="62" cy="24" rx="3" ry="4" fill="#FFB6C1" />
      
      {/* Eyes - large and surprised! */}
      <circle cx="43" cy="33" r="5" fill="#FFFFFF" />
      <circle cx="57" cy="33" r="5" fill="#FFFFFF" />
      
      {/* Pupils - wide with surprise */}
      <circle cx="43" cy="33" r="3.5" fill="#2C1810" />
      <circle cx="57" cy="33" r="3.5" fill="#2C1810" />
      
      {/* Highlights in eyes - makes them sparkle */}
      <circle cx="44" cy="31" r="1.5" fill="#FFFFFF" />
      <circle cx="58" cy="31" r="1.5" fill="#FFFFFF" />
      
      {/* Eyebrows - raised in surprise! */}
      <path
        d="M 38 28 Q 43 26 48 28"
        stroke="#2C1810"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 52 28 Q 57 26 62 28"
        stroke="#2C1810"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Nose - small and dark */}
      <ellipse cx="50" cy="40" rx="3" ry="2.5" fill="#2C1810" />
      
      {/* Mouth - small "O" of surprise */}
      <ellipse cx="50" cy="45" rx="2.5" ry="3.5" fill="#2C1810" opacity="0.8" />
      
      {/* Whiskers */}
      <line x1="30" y1="38" x2="20" y2="36" stroke="#2C1810" strokeWidth="1" strokeLinecap="round" />
      <line x1="30" y1="40" x2="20" y2="40" stroke="#2C1810" strokeWidth="1" strokeLinecap="round" />
      <line x1="30" y1="42" x2="20" y2="44" stroke="#2C1810" strokeWidth="1" strokeLinecap="round" />
      
      <line x1="70" y1="38" x2="80" y2="36" stroke="#2C1810" strokeWidth="1" strokeLinecap="round" />
      <line x1="70" y1="40" x2="80" y2="40" stroke="#2C1810" strokeWidth="1" strokeLinecap="round" />
      <line x1="70" y1="42" x2="80" y2="44" stroke="#2C1810" strokeWidth="1" strokeLinecap="round" />
      
      {/* Front paws */}
      <ellipse cx="40" cy="85" rx="5" ry="6" fill="#8B7355" />
      <ellipse cx="60" cy="85" rx="5" ry="6" fill="#8B7355" />
      
      {/* Tail - curved and fluffy */}
      <path
        d="M 65 70 Q 75 65 80 55 Q 82 50 80 45"
        stroke="#8B7355"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Tail tip - darker */}
      <circle cx="79" cy="45" r="5" fill="#5C4A3A" />
    </svg>
  );
}
