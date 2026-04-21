import React from 'react';

export default function AttributicsLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 relative shrink-0">
        <div className="absolute inset-0 bg-brand-orange rounded-lg rotate-12 opacity-20" />
        <div className="absolute inset-0 bg-brand-green rounded-lg -rotate-12 opacity-20" />
        <div className="absolute inset-0 flex items-center justify-center font-bold text-brand-orange text-xl">
          A
        </div>
      </div>
      <span className="font-bold text-xl tracking-tight text-brand-black">
        Attributics
      </span>
    </div>
  );
}
