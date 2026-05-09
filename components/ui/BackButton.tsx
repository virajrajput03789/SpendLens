'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ 
  className = "", 
  label = "Back",
  fallbackPath = "/" 
}: { 
  className?: string;
  label?: string;
  fallbackPath?: string;
}) {
  const router = useRouter();

  const handleBack = () => {
    // If there's history, go back, otherwise go to fallback
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackPath);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`group flex items-center gap-2 text-[#475569] hover:text-[#6366f1] transition-all text-[14px] font-medium mb-6 ${className}`}
    >
      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#6366f1]/30 group-hover:bg-[#6366f1]/5 transition-all">
        <ArrowLeft className="w-4 h-4" />
      </div>
      <span>{label}</span>
    </button>
  );
}
