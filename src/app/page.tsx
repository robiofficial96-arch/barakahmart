'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  MessageCircle, 
  RotateCcw,
  Check,
  Star,
  PackageCheck,
  CheckCheck,
  ArrowDown,
  ShieldCheck,
  Truck,
  Droplets,
  Crown,
  HeartHandshake,
  Timer,
  BadgeCheck,
  Gift,
  HelpCircle,
  Award,
  ChevronDown,
  ChevronUp,
  BookmarkCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import FlyingBee from '@/components/FlyingBee';
import HoneyBackground from '@/components/HoneyBackground';
import UrgencyTimer from '@/components/UrgencyTimer';
import RecentSalesPopup from '@/components/RecentSalesPopup';

interface PackageOption {
  id: string;
  name: string;
  weight: string;
  regularPrice: number;
  salePrice: number;
  badge?: string;
  popular?: boolean;
  savings: number;
}

const PACKAGES: PackageOption[] = [
  {
    id: 'pkg-1',
    name: '৫০০ গ্রাম প্রিমিয়াম ট্রায়াল প্যাক',
    weight: '৫০০ গ্রাম',
    regularPrice: 650,
    salePrice: 520,
    badge: 'ট্রায়াল প্যাক',
    savings: 130
  },
  {
    id: 'pkg-2',
    name: '১ কেজি ফ্যামিলি প্যাক',
    weight: '১ কেজি',
    regularPrice: 1250,
    salePrice: 980,
    badge: 'সর্বোচ্চ বিক্রিত • ৳২৭০ ছাড়',
    popular: true,
    savings: 270
  },
  {
    id: 'pkg-3',
    name: '২ কেজি মেগা প্যাক (ফ্রি ডেলিভারি)',
    weight: '২ কেজি',
    regularPrice: 2400,
    salePrice: 1850,
    badge: 'ফ্রি ডেলিভারি + সর্বোচ্চ সাশ্রয়',
    savings: 550
  }
];

const REVIEWS = [
  {
    name: 'মাওলানা মোঃ রফিকুল ইসলাম',
    location: 'উত্তরা, ঢাকা',
    rating: 5,
    date: '২ দিন আগে',
    comment: 'মাশাআল্লাহ! পানির টেস্ট দিয়ে পরীক্ষা করেছি, একদম তলানিতে জমা হয়েছে। খাঁটি বুনো চাকের সুবাস পাওয়া যাচ্ছে। বাচ্চাদের প্রতিদিন সকালে এক চামচ করে দিচ্ছি।'
  },
  {
    name: 'তানজিলা হক নিপা',
    location: 'ধানমন্ডি, ঢাকা',
    rating: 5,
    date: '৪ দিন আগে',
    comment: 'ডেলিভারি ম্যানের সামনে বোতল খুলে খেয়ে দেখেছি। কোনো ভেজাল বা চিনির ফ্লেভার নেই। প্যাকিংও খুব মজবুত ছিল।'
  },
  {
    name: 'মাহমুদুল হাসান',
    location: 'চট্টগ্রাম সদর',
    rating: 5,
    date: '১ সপ্তাহ আগে',
    comment: 'সুন্দরবনের আসল কাঁচা মধু খুঁজে পাচ্ছিলাম না অনেকদিন। বারাকাহ মার্টের এই মধুটা সত্যিই অসাধারণ মানের। ২ কেজির অফারটা নিয়ে ভালো করেছি।'
  }
];

export default function LandingPage() {
  // Form State
  const [selectedPkg, setSelectedPkg] = useState<PackageOption>(PACKAGES[1]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryArea, setDeliveryArea] = useState<'dhaka' | 'outside'>('dhaka');
  const [notes, setNotes] = useState('');
  
  // Submission & Feedback State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Auto-fill / Saved Booking Info State
  const [savedBooking, setSavedBooking] = useState<{
    name: string;
    phone: string;
    address: string;
    deliveryArea: 'dhaka' | 'outside';
  } | null>(null);
  const [saveForNextTime, setSaveForNextTime] = useState(true);

  // Scroll position for interactive animated flying bee
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Load saved customer booking info from LocalStorage if exists
    try {
      const stored = localStorage.getItem('bm_saved_customer');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.name && parsed?.phone) {
          setSavedBooking(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // One-click apply saved customer details
  const applySavedBooking = () => {
    if (savedBooking) {
      setName(savedBooking.name);
      setPhone(savedBooking.phone);
      setAddress(savedBooking.address);
      if (savedBooking.deliveryArea) {
        setDeliveryArea(savedBooking.deliveryArea);
      }
    }
  };

  // Business WhatsApp Number
  const WHATSAPP_NUMBER = '8801700000000'; 

  // Calculate pricing
  const isFreeDelivery = selectedPkg.id === 'pkg-3';
  const deliveryCharge = isFreeDelivery ? 0 : (deliveryArea === 'dhaka' ? 70 : 130);
  const totalAmount = selectedPkg.salePrice + deliveryCharge;

  // Scroll to Order Form smoothly
  const scrollToOrder = () => {
    const el = document.getElementById('order-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Submit Handler for Cash on Delivery Form
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন');
      return;
    }
    if (!phone.trim() || phone.trim().length < 11) {
      setFormError('সঠিক ১১ ডিজিটের মোবাইল নম্বর লিখুন (যেমন: 017xxxxxxxx)');
      return;
    }
    if (!address.trim()) {
      setFormError('অনুগ্রহ করে বিস্তারিত ডেলিভারি ঠিকানা লিখুন');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          customerAddress: address,
          packageName: selectedPkg.name,
          packageQty: 1,
          packagePrice: selectedPkg.salePrice,
          deliveryArea: deliveryArea === 'dhaka' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে',
          deliveryCharge,
          totalAmount,
          orderType: 'form',
          notes
        })
      });

      const data = await res.json();
      if (data.success) {
        setOrderSuccess(data.orderId);
        
        // Save booking profile if checked
        if (saveForNextTime) {
          const profile = { name, phone, address, deliveryArea };
          try {
            localStorage.setItem('bm_saved_customer', JSON.stringify(profile));
            setSavedBooking(profile);
          } catch (e) {}
        }

        confetti({
          particleCount: 130,
          spread: 90,
          origin: { y: 0.6 }
        });
      } else {
        setFormError(data.message || 'অর্ডার সম্পন্ন হতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }
    } catch (err) {
      setFormError('সার্ভারে সমস্যা হয়েছে। অনুগ্রহ করে ইন্টারনেট সংযোগ চেক করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate WhatsApp Direct Order Link
  const handleWhatsAppOrder = () => {
    const msg = `আসসালামু আলাইকুম, আমি সরাসরি WhatsApp-এ খাঁটি প্রাকৃতিক মধু অর্ডার করতে চাই।%0A%0A🍯 *প্যাকেজ:* ${selectedPkg.name}%0A💰 *মূল্য:* ৳${selectedPkg.salePrice}%0A🚚 *ডেলিভারি এলাকা:* ${deliveryArea === 'dhaka' ? 'ঢাকার ভেতরে (৳70)' : 'ঢাকার বাইরে (৳130)'}%0A💵 *সর্বমোট প্রদেয়:* ৳${totalAmount}%0A%0A👤 *নাম:* ${name || '[লিখুন]'}%0A📱 *মোবাইল:* ${phone || '[লিখুন]'}%0A📍 *ঠিকানা:* ${address || '[লিখুন]'}`;
    
    // Save as WhatsApp intent in database
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: name || 'WhatsApp ক্রেতা',
        customerPhone: phone || 'WhatsApp',
        customerAddress: address || 'WhatsApp চ্যাট',
        packageName: selectedPkg.name,
        packageQty: 1,
        packagePrice: selectedPkg.salePrice,
        deliveryArea: deliveryArea === 'dhaka' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে',
        deliveryCharge,
        totalAmount,
        orderType: 'whatsapp',
        notes: notes || 'WhatsApp বাটন ক্লিক করে সরাসরি অর্ডার'
      })
    }).catch(() => {});

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  return (
    <div className="relative min-h-screen bg-[#FAF5EB] text-[#241408] antialiased overflow-x-hidden selection:bg-[#F3C465] selection:text-[#3B1E08]">
      
      {/* Subtle Luxury Honeycomb Background */}
      <HoneyBackground />

      {/* Real-time Order Social Proof Popup */}
      <RecentSalesPopup />

      {/* ================= DYNAMIC FLYING HONEY BEE COMPONENT ================= */}
      <FlyingBee scrollY={scrollY} />

      {/* Top Luxury Urgency Bar */}
      <div className="relative z-20 bg-gradient-to-r from-[#602705] via-[#853407] to-[#602705] text-amber-100 py-2.5 px-4 text-center text-xs sm:text-sm font-semibold tracking-wide shadow-lg border-b border-amber-500/30 flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center gap-1.5 text-amber-300 font-black">
          <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
          <span>বিশেষ মূল্যছাড় অফার শেষ হতে বাকি:</span>
        </div>
        <UrgencyTimer />
        <span className="hidden md:inline bg-gradient-to-r from-amber-400 to-amber-300 text-[#421204] text-[11px] px-2.5 py-0.5 rounded-full font-black shadow-sm">
          সীমিত স্টক
        </span>
      </div>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12 relative z-10">

        {/* Brand Header */}
        <div className="text-center mb-10">
          
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 border border-amber-300/80 text-[#92400E] px-5 py-2 rounded-full text-xs sm:text-sm font-bold shadow-sm">
            <Crown className="w-4 h-4 text-amber-600" />
            <span>BARAKAH MART BD • হাফেজ আতাউল্লাহ মাহমুদ</span>
            <Crown className="w-4 h-4 text-amber-600" />
          </div>

          <h1 className="mt-5 text-3xl sm:text-5xl md:text-6xl font-black text-[#451A03] leading-[1.25] tracking-tight">
            প্রকৃতির খাঁটি উপহার — <br className="hidden sm:inline" />
            <span className="text-[#B45309] inline-block mt-1">
              সুন্দরবনের চাকের ১০০% নির্ভেজাল কাঁচা মধু
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-stone-700 max-w-2xl mx-auto leading-relaxed font-medium">
            "বারাকাহ মার্ট বিডি থেকে আমি হাফেজ আতাউল্লাহ মাহমুদ আপনাকে স্বাগতম জানাচ্ছি। আমাদের প্রতিটি প্রডাক্ট আপনাদের দিচ্ছি সম্পূর্ণ নির্ভেজাল ও শতভাগ সততার সাথে।"
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-bold">
            <span className="inline-flex items-center gap-1.5 text-amber-950 bg-amber-200/70 px-4 py-1.5 rounded-full border border-amber-300 shadow-sm">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> ৪.৯/৫ কাস্টমার সন্তুষ্টি
            </span>
            <span className="inline-flex items-center gap-1.5 text-emerald-950 bg-emerald-100 px-4 py-1.5 rounded-full border border-emerald-300 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-700" /> ১০০% মানি-ব্যাক গ্যারান্টি
            </span>
            <span className="inline-flex items-center gap-1.5 text-orange-950 bg-orange-100 px-4 py-1.5 rounded-full border border-orange-300 shadow-sm">
              <Truck className="w-4 h-4 text-orange-700" /> ক্যাশ অন হোম ডেলিভারি
            </span>
          </div>
        </div>

        {/* Hero Visual Card with Pure Honey Jar Illustration & Details */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white border-2 border-amber-300/80 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            
            {/* Pure Honey Showcase Graphic */}
            <div className="relative h-80 sm:h-96 md:h-full min-h-[400px] w-full bg-gradient-to-br from-[#92400E] via-[#B45309] to-[#78350F] overflow-hidden flex flex-col items-center justify-center p-8 text-center text-white">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/40 via-transparent to-black/35"></div>
              
              {/* Giant Glowing Honey Jar Graphic */}
              <div className="relative z-10 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-amber-400/20 backdrop-blur-md p-4 flex items-center justify-center border-4 border-amber-300/50 shadow-2xl mb-4 group hover:scale-105 transition-transform duration-500">
                <span className="text-7xl sm:text-8xl animate-pulse">🍯</span>
              </div>

              <div className="relative z-10">
                <div className="inline-block bg-amber-950/70 backdrop-blur-sm text-amber-200 text-xs font-black px-4 py-1.5 rounded-full border border-amber-400/40 mb-2 shadow-sm">
                  ১০০% খাঁটি কাঁচা মধু (Raw Wild Honey)
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-amber-100">
                  প্রাকৃতিক মৌচাকের নির্ভেজাল মধু
                </h3>
                <p className="text-xs sm:text-sm text-amber-200/90 mt-1.5 max-w-xs mx-auto leading-relaxed">
                  বুনো ফুলের তাজা মিষ্টি সুবাস ও প্রাকৃতিক অ্যান্টি-অক্সিডেন্টে ভরপুর।
                </p>
              </div>

              <div className="absolute bottom-3.5 left-3.5 right-3.5 bg-black/60 backdrop-blur-md text-white text-xs p-2.5 rounded-2xl border border-white/20 text-center font-medium shadow-lg z-10">
                ✨ কোনো হিট বা কেমিক্যাল প্রসেসিং নেই — প্রাকৃতিক এনজাইম অক্ষুণ্ণ
              </div>
            </div>

            {/* Right Side Highlights */}
            <div className="p-6 sm:p-9 space-y-5 bg-gradient-to-br from-[#FFFDF9] via-[#FAF3E7] to-[#F5EAD4]">
              
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-[#78350F] text-xs font-black px-3.5 py-1.5 rounded-xl border border-amber-400/40">
                <Crown className="w-4 h-4 text-amber-700" />
                বারাকাহ স্পেশাল গ্রেড
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#451A03] leading-snug">
                প্রতিদিন এক চামচ খাঁটি মধু, সুস্থ রাখবে পুরো পরিবারকে!
              </h2>

              <ul className="space-y-3.5 text-xs sm:text-sm text-stone-800">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <CheckCheck className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <span><strong>০% চিনি ও সিরাপ:</strong> চিনি বা ভুট্টার সিরাপের কোনো মিশ্রণ নেই — ১০০% প্রাকৃতিকভাবে সংগৃহীত।</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <CheckCheck className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <span><strong>অরিজিনাল স্বাদ ও তীব্র সুবাস:</strong> খাঁটি কাঁচা মধুর স্বাদ মুখে দীর্ঘক্ষণ থাকে এবং ঠাণ্ডা-কাশিতে দারুণ উপকারী।</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <CheckCheck className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <span><strong>হাতে পেয়ে যাচাই করার সুযোগ:</strong> পার্সেল খুলে দেখে, চেখে ও খাঁটি কিনা নিশ্চিত হয়ে মূল্য পরিশোধ করুন।</span>
                </li>
              </ul>

              {/* Instant Action CTA Button */}
              <div className="pt-2">
                <button
                  onClick={scrollToOrder}
                  className="w-full py-4 px-6 bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#B45309] hover:from-[#92400E] hover:to-[#B45309] text-white font-black text-base sm:text-lg rounded-2xl shadow-xl hover:shadow-amber-900/30 transform hover:-translate-y-0.5 active:translate-y-0 transition duration-200 flex items-center justify-center gap-2 cursor-pointer ring-2 ring-amber-400/40"
                >
                  <ShoppingBag className="w-5 h-5 text-amber-200" />
                  মধু অর্ডার করতে নিচের ফর্মে যান
                  <ArrowDown className="w-5 h-5 text-amber-200 animate-bounce" />
                </button>
                <p className="text-[11px] text-stone-600 text-center mt-2 font-semibold">
                  ⚡ অগ্রিম পেমেন্টের কোনো ঝামেলা নেই — ক্যাশ অন ডেলিভারি
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* 4 Premium Value Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5 mb-14">
          <div className="bg-white border-2 border-amber-200/80 rounded-3xl p-5 text-center flex flex-col items-center justify-center shadow-md hover:border-amber-400 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-amber-100/80 text-[#B45309] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="font-black text-base text-[#451A03]">১০০% নির্ভেজাল</h3>
            <p className="text-xs text-stone-600 mt-1">কোনো চিনি বা সিরাপ নেই</p>
          </div>

          <div className="bg-white border-2 border-amber-200/80 rounded-3xl p-5 text-center flex flex-col items-center justify-center shadow-md hover:border-amber-400 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Truck className="w-8 h-8" />
            </div>
            <h3 className="font-black text-base text-[#451A03]">ক্যাশ অন ডেলিভারি</h3>
            <p className="text-xs text-stone-600 mt-1">পণ্য হাতে পেয়ে মূল্য দিন</p>
          </div>

          <div className="bg-white border-2 border-amber-200/80 rounded-3xl p-5 text-center flex flex-col items-center justify-center shadow-md hover:border-amber-400 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-blue-100/80 text-blue-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <RotateCcw className="w-8 h-8" />
            </div>
            <h3 className="font-black text-base text-[#451A03]">মানি-ব্যাক গ্যারান্টি</h3>
            <p className="text-xs text-stone-600 mt-1">ভেজাল প্রমাণে ১০০% ফেরত</p>
          </div>

          <div className="bg-white border-2 border-amber-200/80 rounded-3xl p-5 text-center flex flex-col items-center justify-center shadow-md hover:border-amber-400 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-orange-100/80 text-orange-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Droplets className="w-8 h-8" />
            </div>
            <h3 className="font-black text-base text-[#451A03]">প্রাকৃতিক চাকের মধু</h3>
            <p className="text-xs text-stone-600 mt-1">মৌয়ালদের কাটা তাজা মধু</p>
          </div>
        </div>

        {/* Benefits & Testing Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-amber-200/90 mb-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#92400E] bg-amber-100 border border-amber-300 px-3.5 py-1 rounded-full">
                <span>🍯</span> সুন্নাহ সম্মত শেফা ও পুষ্টি
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#451A03] leading-snug">
                খাঁটি মধুর অবিশ্বাস্য স্বাস্থ্য উপকারিতা
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-stone-700">
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">✓</div>
                  <span>রোগ প্রতিরোধ ক্ষমতা বহুগুণে বৃদ্ধি করে।</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">✓</div>
                  <span>কাশি, ঠাণ্ডা ও গলার খুশখুশে ভাব দ্রুত উপশম করে।</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">✓</div>
                  <span>হজমে সহায়তা করে ও গ্যাস্ট্রিকের সমস্যা কমায়।</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">✓</div>
                  <span>প্রাকৃতিক এনার্জি বুস্টার হিসেবে তাৎক্ষণিক শক্তি যোগায়।</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 p-6 rounded-2xl border-2 border-amber-300/80 space-y-3 shadow-inner">
              <h4 className="font-black text-[#78350F] text-base sm:text-lg flex items-center gap-2">
                <span>🔍</span> খাঁটি মধু চেনার সহজ উপায়:
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                ১. <strong>পানির টেস্ট:</strong> এক গ্লাস পানিতে এক চামচ মধু দিলে খাঁটি মধু সরাসরি নিচে জমা হবে, সহজে মিশে যাবে না।
              </p>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                ২. <strong>স্বভাব ও টেক্সচার:</strong> খাঁটি কাঁচা মধুর স্বাদ মুখে দীর্ঘ সময় লেগে থাকে এবং এতে হালকা প্রাকৃতিক ফুলের সুবাস পাওয়া যায়।
              </p>
              <div className="bg-white p-3.5 rounded-xl border border-amber-300 text-xs font-black text-[#B45309] text-center shadow-sm">
                গ্যারান্টি: আমাদের মধুতে কোনো প্রকার ভেজাল প্রমাণ করতে পারলে সম্পূর্ণ মূল্য ফেরত দেওয়া হবে!
              </div>
            </div>

          </div>
        </section>

        {/* ================= REVIEWS / SOCIAL PROOF SECTION ================= */}
        <section className="mb-14">
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-black text-[#92400E] bg-amber-100 border border-amber-300 px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
              গ্রাহকদের মতামত
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#451A03]">
              আমাদের নিয়মিত গ্রাহকরা কী বলছেন?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {REVIEWS.map((rev, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-amber-200/90 shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-2">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-stone-900">{rev.name}</h5>
                    <span className="text-[10px] text-stone-400">{rev.location}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" /> ভেরিফাইড ক্রেতা
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== ORDER SECTION ===================== */}
        <section id="order-section" className="scroll-mt-6 bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-amber-400">
          
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#92400E] bg-amber-100 border border-amber-300 px-4 py-1.5 rounded-full tracking-wider mb-2.5">
              <PackageCheck className="w-4 h-4 text-[#B45309]" />
              সহজ ও দ্রুত ১-ক্লিক অর্ডার
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#451A03]">
              খাঁটি মধু অর্ডার করতে ফর্মটি পূরণ করুন
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 font-medium">
              কোনো অগ্রিম টাকা দিতে হবে না — পার্সেল হাতে পেয়ে ডেলিভারি ম্যানকে মূল্য পরিশোধ করুন
            </p>
          </div>

          {orderSuccess ? (
            /* Thank You Box after successful order */
            <div className="bg-emerald-50 border-2 border-emerald-400 rounded-3xl p-8 sm:p-10 text-center animate-fade-in shadow-inner">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl ring-4 ring-emerald-200">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-950">
                আলহামদুলিল্লাহ! আপনার মধু অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।
              </h3>
              <p className="text-sm sm:text-base text-emerald-900 mt-2 font-bold">
                আপনার অর্ডার ট্র্যাকিং আইডি: <span className="font-mono bg-white px-3 py-1 rounded-lg border border-emerald-300 text-emerald-950 shadow-sm">{orderSuccess}</span>
              </p>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto mt-4 leading-relaxed font-normal">
                আমাদের কাস্টমার কেয়ার প্রতিনিধি শীঘ্রই আপনার নম্বরে ফোন দিয়ে অর্ডারটি কনফার্ম করবেন এবং নিরাপদে পার্সেলটি পাঠিয়ে দেওয়া হবে।
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setOrderSuccess(null)}
                  className="px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-2xl text-xs sm:text-sm transition shadow-lg cursor-pointer"
                >
                  আরেকটি নতুন অর্ডার করুন
                </button>
              </div>
            </div>
          ) : (
            /* Order Form */
            <form onSubmit={handleSubmitOrder} className="space-y-7">
              
              {/* 1. Step: Choose Package */}
              <div>
                <label className="block text-base font-black text-stone-900 mb-3 flex items-center gap-2.5">
                  <span className="w-7 h-7 bg-[#B45309] text-white text-xs font-black rounded-full flex items-center justify-center shadow-md">১</span>
                  প্যাকেজ নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {PACKAGES.map((pkg) => {
                    const isSelected = selectedPkg.id === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPkg(pkg)}
                        className={`cursor-pointer relative rounded-2xl p-4 sm:p-5 transition-all duration-200 border-2 ${
                          isSelected
                            ? 'border-[#B45309] bg-gradient-to-b from-amber-50 to-orange-50/50 shadow-md ring-2 ring-[#B45309]/20'
                            : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-stone-50/70'
                        }`}
                      >
                        {pkg.badge && (
                          <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 text-[10px] font-black px-3.5 py-0.5 rounded-full shadow-sm whitespace-nowrap ${
                            pkg.popular 
                              ? 'bg-[#B45309] text-white ring-2 ring-white' 
                              : 'bg-amber-400 text-amber-950 ring-2 ring-white'
                          }`}>
                            {pkg.badge}
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-1.5 mt-1">
                          <span className="font-black text-sm text-stone-900">{pkg.name}</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-[#B45309] bg-[#B45309]' : 'border-stone-400'
                          }`}>
                            {isSelected && <span className="w-2 h-2 bg-white rounded-full"></span>}
                          </div>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-2xl font-black text-[#B45309]">৳{pkg.salePrice}</span>
                          <span className="text-xs text-stone-400 line-through font-semibold">৳{pkg.regularPrice}</span>
                        </div>
                        <div className="mt-1 text-[11px] font-bold text-emerald-700">
                          সাশ্রয়: ৳{pkg.savings}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Step: Delivery Location */}
              <div>
                <label className="block text-base font-black text-stone-900 mb-3 flex items-center gap-2.5">
                  <span className="w-7 h-7 bg-[#B45309] text-white text-xs font-black rounded-full flex items-center justify-center shadow-md">২</span>
                  ডেলিভারি লোকেশন সিলেক্ট করুন:
                </label>
                <div className="grid grid-cols-2 gap-3.5">
                  <button
                    type="button"
                    onClick={() => setDeliveryArea('dhaka')}
                    className={`py-3.5 px-4 rounded-xl border-2 text-left font-black text-xs sm:text-sm transition flex items-center justify-between cursor-pointer ${
                      deliveryArea === 'dhaka'
                        ? 'border-[#B45309] bg-amber-50/90 text-stone-900 shadow-sm'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <span>ঢাকার ভেতরে</span>
                    <span className="text-[#B45309] font-black">
                      {isFreeDelivery ? <span className="text-emerald-700">ফ্রি</span> : '৳৭০'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryArea('outside')}
                    className={`py-3.5 px-4 rounded-xl border-2 text-left font-black text-xs sm:text-sm transition flex items-center justify-between cursor-pointer ${
                      deliveryArea === 'outside'
                        ? 'border-[#B45309] bg-amber-50/90 text-stone-900 shadow-sm'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <span>ঢাকার বাইরে</span>
                    <span className="text-[#B45309] font-black">
                      {isFreeDelivery ? <span className="text-emerald-700">ফ্রি</span> : '৳১৩০'}
                    </span>
                  </button>
                </div>
              </div>

              {/* 3. Step: Customer Info Inputs */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="block text-base font-black text-stone-900 flex items-center gap-2.5">
                    <span className="w-7 h-7 bg-[#B45309] text-white text-xs font-black rounded-full flex items-center justify-center shadow-md">৩</span>
                    আপনার ডেলিভারি তথ্য দিন:
                  </label>

                  {/* 1-Click Saved Booking Profile Autofill Button */}
                  {savedBooking && (
                    <button
                      type="button"
                      onClick={applySavedBooking}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 border border-amber-300 rounded-xl text-xs font-black text-[#92400E] shadow-sm transition active:scale-95 cursor-pointer animate-pulse"
                      title="পূর্বে সেভ করা নাম ও ঠিকানা দিয়ে ফর্ম পূরণ করুন"
                    >
                      <BookmarkCheck className="w-4 h-4 text-emerald-700" />
                      <span>সেভ করা বুকিং দিয়ে পূরণ করুন ({savedBooking.name})</span>
                    </button>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-stone-700">আপনার পূর্ণ নাম *</label>
                    {savedBooking && (
                      <span 
                        onClick={applySavedBooking}
                        className="text-[11px] text-[#B45309] font-bold underline cursor-pointer hover:text-amber-800"
                      >
                        ⚡ পূর্বের ডাটা আনুন
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মোঃ কামরুল হাসান"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B45309] text-sm bg-stone-50/70"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">১১ ডিজিটের সচল মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    placeholder="যেমন: 017xxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B45309] text-sm bg-stone-50/70"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">সম্পূর্ণ ডেলিভারি ঠিকানা (বাসা/রোড/এলাকা/উপজেলা/জেলা) *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="যেমন: বাসা নং ১০, রোড ৪, সেক্টর ৭, উত্তরা, ঢাকা"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B45309] text-sm bg-stone-50/70 resize-none"
                  ></textarea>
                </div>

                {/* Save info for next time checkbox */}
                <div className="flex items-center gap-2 pt-1 text-xs text-stone-700 select-none">
                  <input
                    type="checkbox"
                    id="saveBookingInfo"
                    checked={saveForNextTime}
                    onChange={(e) => setSaveForNextTime(e.target.checked)}
                    className="w-4 h-4 accent-[#B45309] rounded cursor-pointer"
                  />
                  <label htmlFor="saveBookingInfo" className="cursor-pointer font-medium text-stone-600">
                    পরবর্তী অর্ডারের জন্য এই নাম ও ঠিকানা সেভ করে রাখুন
                  </label>
                </div>
              </div>

              {/* Pricing Breakdown Summary */}
              <div className="bg-[#FAF5EB] rounded-2xl p-5 border border-stone-300/80 space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>প্যাকেজ ({selectedPkg.name}):</span>
                  <span className="font-bold text-stone-900">৳{selectedPkg.salePrice}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="font-bold text-stone-900">
                    {deliveryCharge === 0 ? <span className="text-emerald-700 font-black">ফ্রি (০ টাকা)</span> : `৳${deliveryCharge}`}
                  </span>
                </div>
                <div className="border-t border-stone-300 pt-2.5 flex justify-between items-center text-sm sm:text-base font-black text-stone-900">
                  <span>সর্বমোট প্রদেয় মূল্য:</span>
                  <span className="text-2xl sm:text-3xl text-[#B45309]">৳{totalAmount}</span>
                </div>
                <div className="text-[11px] text-stone-600 text-center pt-1 font-medium">
                  (কোনো অগ্রিম পেমেন্ট নেই — পণ্য হাতে পাওয়ার পর ডেলিভারি ম্যানের কাছে পরিশোধ করবেন)
                </div>
              </div>

              {formError && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl font-bold">
                  ⚠️ {formError}
                </div>
              )}

              {/* ================= ACTIONS: ONE CLICK COD ORDER & DIRECT IN-PLACE WHATSAPP BUTTON ================= */}
              <div className="space-y-3.5 pt-2">
                
                {/* 1. Main Confirm Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#B45309] hover:from-[#92400E] hover:to-[#B45309] text-white font-black text-base sm:text-lg rounded-2xl shadow-xl hover:shadow-amber-950/20 active:scale-[0.99] transition duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  <ShoppingBag className="w-5 h-5 text-amber-200" />
                  {isSubmitting ? 'অর্ডার প্রসেস হচ্ছে...' : `অর্ডার কনফার্ম করুন — ৳${totalAmount}`}
                </button>

                {/* Divider */}
                <div className="relative flex py-1.5 items-center">
                  <div className="flex-grow border-t border-stone-300"></div>
                  <span className="flex-shrink mx-4 text-xs text-stone-500 font-bold bg-white px-2">অথবা সরাসরি চ্যাটে কথা বলুন</span>
                  <div className="flex-grow border-t border-stone-300"></div>
                </div>

                {/* 2. Embedded WhatsApp Button (Inside the form / order area, not floating) */}
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black text-sm sm:text-base rounded-2xl shadow-md transition duration-150 flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 text-white fill-white" />
                  WhatsApp-এ সরাসরি অর্ডার করুন
                </button>

              </div>

            </form>
          )}

        </section>

        {/* Customer FAQ Interactive Accordion Section */}
        <section className="mt-14 bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200">
          <h3 className="text-xl sm:text-2xl font-black text-[#451A03] mb-6 text-center">
            সাধারণ কিছু প্রশ্নোত্তর (FAQ)
          </h3>
          <div className="space-y-3 text-xs sm:text-sm">
            {[
              {
                q: 'আমি কি পার্সেল খুলে মধু চেখে দেখতে পারব?',
                a: 'হ্যাঁ, ডেলিভারি ম্যানের উপস্থিতিতে আপনি প্যাকেট খুলে মধুর খাঁটি ঘ্রাণ ও স্বাদ পরীক্ষা করে নিতে পারবেন। সন্তুষ্ট না হলে সাথে সাথেই কোনো চার্জ ছাড়াই রিটার্ন করতে পারবেন।'
              },
              {
                q: 'এই মধু কি কোনো প্রসেস বা গরম করা হয়েছে?',
                a: 'একদমই না। এটি সম্পূর্ণ কাঁচা ও প্রাকৃতিক (Raw Honey), যার মধ্যে মৌচাকের স্বাভাবিক পরাগরেণু ও এনজাইম অক্ষুণ্ণ রয়েছে।'
              },
              {
                q: 'শীতকালে খাঁটি মধু কি জমে যায়?',
                a: 'হ্যাঁ, প্রাকৃতিক কাঁচা মধুর একটি স্বাভাবিক বৈশিষ্ট্য হলো গ্লুকোজের পরিমাণের কারণে বিশেষ কিছু ফুলের মধু শীতের ঠান্ডায় জমতে পারে (ক্রিস্টালাইজ হতে পারে)। এটি খাঁটি মধুর একটি বড় প্রমাণ।'
              },
              {
                q: 'ডেলিভারি পেতে কতদিন সময় লাগবে?',
                a: 'ঢাকার ভেতরে সাধারণত ২৪ ঘণ্টার মধ্যে এবং ঢাকার বাইরে ২ থেকে ৩ দিনের মধ্যে আপনার ঠিকানায় পৌঁছে যাবে।'
              }
            ].map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index} 
                  className="bg-[#FAF5EB] rounded-2xl border border-stone-200/80 overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left font-bold text-stone-900 text-sm sm:text-base flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-[#B45309] shrink-0" /> : <ChevronDown className="w-5 h-5 text-stone-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-stone-600 text-xs sm:text-sm leading-relaxed border-t border-stone-200/50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-14 text-center text-xs text-stone-600 pb-10 space-y-2">
          <p className="font-black text-stone-800 text-sm">Barakah Mart BD • বিশুদ্ধতাই আমাদের পরিচয়</p>
          <p>যেকোনো জিজ্ঞাসা বা প্রয়োজনে কল করুন: <a href="tel:01700000000" className="text-[#B45309] font-bold">01700-000000</a></p>
          <p className="text-[11px] text-stone-400">© 2026 Barakah Mart BD. All rights reserved.</p>
        </footer>

      </main>

    </div>
  );
}
