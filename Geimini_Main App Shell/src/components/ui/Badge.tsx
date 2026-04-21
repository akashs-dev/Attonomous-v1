import React from 'react';
import { cn } from '../../lib/utils';

export type BadgeStatus = 'active' | 'paused' | 'draft' | 'completed' | 'warning';

interface BadgeProps {
  status: BadgeStatus;
  label?: string;
  className?: string;
}

export default function Badge({ status, label, className }: BadgeProps) {
  const configs = {
    active: { bg: "bg-[#D1FAE5]", text: "text-[#065F46]", dot: "bg-brand-green" },
    completed: { bg: "bg-[#D1FAE5]", text: "text-[#065F46]", dot: "bg-brand-green" },
    paused: { bg: "bg-[#FEF3C7]", text: "text-[#92400E]", dot: "bg-[#FBBF24]" },
    warning: { bg: "bg-[#FEF3C7]", text: "text-[#92400E]", dot: "bg-brand-orange" },
    draft: { bg: "bg-[#F3F4F6]", text: "text-[#374151]", dot: "bg-brand-gray-light" },
  };

  const config = configs[status];

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium tracking-tight",
      config.bg,
      config.text,
      className
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {label || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
