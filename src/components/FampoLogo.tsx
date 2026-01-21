import React from 'react';

interface FampoLogoProps {
  className?: string;
  size?: number;
}

export default function FampoLogo({ className = "", size = 40 }: FampoLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Premium gradient */}
        <linearGradient id="fampoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        
        {/* Shadow */}
        <filter id="logoShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
          <feOffset dx="0" dy="2.5" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Elegant rounded square background */}
      <rect 
        x="2" 
        y="2" 
        width="36" 
        height="36" 
        rx="10" 
        fill="url(#fampoGradient)" 
        filter="url(#logoShadow)"
      />
      
      {/* Extraordinary design: Abstract overlapping layers representing family layers/connections */}
      {/* Layer 1 - Back */}
      <path 
        d="M 8 15 L 20 8 L 32 15 L 32 25 L 20 32 L 8 25 Z" 
        fill="white" 
        opacity="0.4"
      />
      
      {/* Layer 2 - Middle */}
      <path 
        d="M 10 18 L 20 12 L 30 18 L 30 26 L 20 30 L 10 26 Z" 
        fill="white" 
        opacity="0.7"
      />
      
      {/* Layer 3 - Front */}
      <path 
        d="M 12 21 L 20 16 L 28 21 L 28 27 L 20 28 L 12 27 Z" 
        fill="white" 
        opacity="1"
      />
      
      {/* Central accent */}
      <circle 
        cx="20" 
        cy="22" 
        r="2.5" 
        fill="url(#fampoGradient)"
        opacity="0.9"
      />
    </svg>
  );
}
