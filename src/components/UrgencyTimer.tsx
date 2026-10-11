'use client';

import React, { useEffect, useState } from 'react';

export default function UrgencyTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 2, minutes: 30, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const format = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-1.5 text-xs font-black">
      <div className="bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded shadow-inner">
        {format(timeLeft.hours)}
      </div>
      <span className="text-amber-300">:</span>
      <div className="bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded shadow-inner">
        {format(timeLeft.minutes)}
      </div>
      <span className="text-amber-300">:</span>
      <div className="bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded shadow-inner">
        {format(timeLeft.seconds)}
      </div>
    </div>
  );
}
