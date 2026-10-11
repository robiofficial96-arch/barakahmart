'use client';

import React, { useEffect, useState } from 'react';

interface FlyingBeeProps {
  scrollY: number;
}

export default function FlyingBee({ scrollY }: FlyingBeeProps) {
  const [windowWidth, setWindowWidth] = useState(1200);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  const isMobile = windowWidth < 640;

  // Smooth sinusoidal trajectory across the width
  // When scrolling, the bee moves from Left to Right and back across sections!
  const progress = scrollY * 0.0035; 
  const horizontalFactor = (Math.sin(progress) + 1) / 2; // oscillates smoothly between 0 and 1
  
  // X Position: wanders smoothly across the entire screen!
  const xPos = isMobile 
    ? 15 + horizontalFactor * (windowWidth - 85)
    : 30 + horizontalFactor * (windowWidth - 130);

  // Y Position: moves down smoothly as user scrolls, staying comfortably in viewport
  const verticalBob = Math.sin(progress * 2.5) * 16;
  const baseTopVh = isMobile ? 22 : 18;
  const topPercent = Math.min(80, baseTopVh + (scrollY * 0.04) % 55) + verticalBob / 10;

  // Dynamic facing direction (rotates and flips when flying left vs right)
  const isFlyingLeft = Math.cos(progress) < 0;
  const tiltDeg = Math.cos(progress) * 16;

  return (
    <div
      className="fixed z-50 pointer-events-none select-none transition-transform duration-200 ease-out"
      style={{
        top: `${topPercent}vh`,
        left: `${xPos}px`,
        transform: `rotate(${tiltDeg}deg) ${isFlyingLeft ? 'scaleX(-1)' : 'scaleX(1)'}`,
      }}
    >
      <div className="relative">
        
        {/* Floating Speech Tag (keeps text readable even when bee flips) */}
        <div 
          className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white font-black text-[9px] sm:text-[11px] px-2.5 py-0.5 rounded-full shadow-lg border border-amber-300 flex items-center gap-1 whitespace-nowrap animate-pulse"
          style={{ transform: `scaleX(${isFlyingLeft ? -1 : 1}) translateX(-50%)` }}
        >
          <span>🍯</span>
          <span>খাঁটি মধুর সুবাস!</span>
        </div>

        {/* 100% Transparent SVG Animated Bee with rapid wing flap */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-[0_8px_16px_rgba(245,158,11,0.55)]">
          <svg
            viewBox="0 0 160 160"
            className="w-full h-full overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Sparkle Honey Trail */}
            <g className="animate-pulse">
              <circle cx="20" cy="110" r="4" fill="#FBBF24" />
              <circle cx="35" cy="122" r="3" fill="#F59E0B" />
              <circle cx="48" cy="106" r="4" fill="#FCD34D" />
            </g>

            {/* Back Wing with rapid flap */}
            <g className="origin-[85px_65px] animate-[wingFlap_0.1s_infinite_alternate]">
              <ellipse
                cx="65"
                cy="38"
                rx="28"
                ry="14"
                transform="rotate(-30 65 38)"
                fill="url(#wingGradient)"
                stroke="#93C5FD"
                strokeWidth="1.5"
                opacity="0.85"
              />
              <path
                d="M50 48 Q 65 40 75 32"
                stroke="#60A5FA"
                strokeWidth="1"
                opacity="0.6"
              />
            </g>

            {/* Front Wing with rapid flap */}
            <g className="origin-[95px_65px] animate-[wingFlap_0.1s_infinite_alternate_reverse]">
              <ellipse
                cx="110"
                cy="36"
                rx="26"
                ry="13"
                transform="rotate(32 110 36)"
                fill="url(#wingGradient)"
                stroke="#93C5FD"
                strokeWidth="1.5"
                opacity="0.9"
              />
              <path
                d="M95 32 Q 108 40 120 48"
                stroke="#60A5FA"
                strokeWidth="1"
                opacity="0.6"
              />
            </g>

            {/* Stinger */}
            <path
              d="M42 92 L26 95 L40 102 Z"
              fill="#261205"
            />

            {/* Chubby Golden Body */}
            <ellipse
              cx="85"
              cy="95"
              rx="46"
              ry="34"
              transform="rotate(6 85 95)"
              fill="url(#beeBodyGradient)"
            />

            {/* Bold Stripes */}
            <path
              d="M60 67 C 68 76, 70 114, 62 123 C 54 114, 52 76, 60 67 Z"
              fill="#2A1406"
            />
            <path
              d="M80 62 C 89 74, 91 118, 82 128 C 73 118, 71 74, 80 62 Z"
              fill="#2A1406"
            />
            <path
              d="M102 65 C 110 76, 110 115, 103 124 C 95 116, 94 77, 102 65 Z"
              fill="#2A1406"
            />

            {/* Bee Head */}
            <circle
              cx="120"
              cy="90"
              r="24"
              fill="#F59E0B"
            />
            
            {/* Cute Rosy Cheek */}
            <ellipse
              cx="115"
              cy="100"
              rx="5"
              ry="3"
              fill="#F87171"
              opacity="0.75"
            />

            {/* Big Sparkly Cartoon Eye */}
            <circle
              cx="128"
              cy="84"
              r="7.5"
              fill="#1E120A"
            />
            <circle
              cx="130"
              cy="82"
              r="2.8"
              fill="#FFFFFF"
            />
            <circle
              cx="126"
              cy="86"
              r="1.3"
              fill="#FFFFFF"
            />

            {/* Smile */}
            <path
              d="M125 96 Q 131 102 136 94"
              stroke="#451A03"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Antennae */}
            <path
              d="M126 68 Q 130 52 140 50"
              stroke="#381907"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="141" cy="50" r="3.5" fill="#F59E0B" />

            <path
              d="M118 68 Q 116 54 110 52"
              stroke="#381907"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="109" cy="52" r="3" fill="#F59E0B" />

            {/* Gradients */}
            <defs>
              <linearGradient id="beeBodyGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FCD34D" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              <linearGradient id="wingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EFF6FF" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#BFDBFE" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>
        </div>

      </div>
    </div>
  );
}
