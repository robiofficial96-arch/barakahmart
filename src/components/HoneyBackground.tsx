'use client';

import React, { useEffect, useState } from 'react';

export default function HoneyBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-35">
      {/* Organic Golden Honeycomb Subtle Pattern */}
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="honeycomb-pattern"
            width="56"
            height="100"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(1)"
          >
            <path
              d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100"
              fill="none"
              stroke="#D97706"
              strokeWidth="0.8"
              strokeOpacity="0.25"
            />
            <path
              d="M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="0.5"
              strokeOpacity="0.15"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#honeycomb-pattern)" />
      </svg>

      {/* Ambient Warm Golden Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl"></div>
    </div>
  );
}
