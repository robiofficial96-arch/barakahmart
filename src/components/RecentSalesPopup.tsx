'use client';

import React, { useEffect, useState } from 'react';

const RECENT_CUSTOMERS = [
  { name: 'মোঃ তানভীর আহমেদ', city: 'মিরপুর, ঢাকা', pkg: '১ কেজি ফ্যামিলি প্যাক', time: '৪ মিনিট আগে' },
  { name: 'আরিফুল ইসলাম', city: 'চট্টগ্রাম সদর', pkg: '২ কেজি মেগা প্যাক', time: '৮ মিনিট আগে' },
  { name: 'মাহবুবুর রহমান', city: 'উত্তরা, ঢাকা', pkg: '১ কেজি ফ্যামিলি প্যাক', time: '১২ মিনিট আগে' },
  { name: 'ডাঃ মোর্শেদ জামান', city: 'সিলেট', pkg: '৫০০ গ্রাম ট্রায়াল প্যাক', time: '১৫ মিনিট আগে' },
  { name: 'হাসানুল হক', city: 'ধানমন্ডি, ঢাকা', pkg: '২ কেজি মেগা প্যাক', time: '১৯ মিনিট আগে' },
];

export default function RecentSalesPopup() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show first popup after 4 seconds
    const initialTimeout = setTimeout(() => {
      setVisible(true);
    }, 4000);

    // Loop through customers every 12 seconds
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % RECENT_CUSTOMERS.length);
        setVisible(true);
      }, 1000);
    }, 14000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (!visible) return null;

  const current = RECENT_CUSTOMERS[index];

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-xs bg-white/95 backdrop-blur-md border border-amber-300 rounded-2xl p-3 shadow-2xl transition-all duration-500 transform translate-y-0 opacity-100 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-lg shrink-0 shadow-md">
        🍯
      </div>
      <div className="text-[11px] leading-tight">
        <p className="font-black text-stone-900">{current.name} <span className="text-[10px] text-stone-400 font-normal">({current.city})</span></p>
        <p className="text-amber-800 font-bold mt-0.5">{current.pkg} অর্ডার করেছেন</p>
        <p className="text-[9px] text-stone-400 mt-0.5">⚡ {current.time}</p>
      </div>
    </div>
  );
}
