import type { Metadata } from "next";
import { Noto_Serif_Bengali, Tiro_Bangla } from "next/font/google";
import "./globals.css";

const notoSerifBengali = Noto_Serif_Bengali({
  weight: ['400', '600', '700', '800', '900'],
  subsets: ['bengali'],
  variable: '--font-noto-serif-bengali',
  display: 'swap',
});

const tiroBangla = Tiro_Bangla({
  weight: ['400'],
  subsets: ['bengali'],
  variable: '--font-tiro-bangla',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "১০০% খাঁটি ও প্রাকৃতিক সুন্দরবনের মধু | Barakah Mart BD",
  description: "সুন্দরবনের প্রাকৃতিক চাকের খাঁটি কাঁচা মধু (Raw Honey)। কোনো প্রসেসিং বা চিনি ছাড়া সরাসরি মৌচাকের মধু। ক্যাশ অন ডেলিভারিতে অর্ডার করুন।",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={`${notoSerifBengali.variable} ${tiroBangla.variable} scroll-smooth`}>
      <body className="antialiased bg-[#FAF5EB] text-[#241408] min-h-screen">
        {children}
      </body>
    </html>
  );
}
