import React from 'react'

const statusStyles: Record<string, string> = {
  'Pending':     'bg-amber-100 text-amber-800',
  'In Progress': 'bg-orange-100 text-orange-700',
  'Approved':    'bg-green-100 text-green-700',
  'Rejected':    'bg-red-100 text-red-700',
  'Brief':       'bg-purple-100 text-purple-700',
  'Workshop':    'bg-orange-100 text-orange-700',
  'Push':        'bg-orange-50 text-orange-700',
}

export default function StatusBadge({ status, className = '' }: { status: string; className?: string }) {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-600'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${style} ${className}`}>
      {status}
    </span>
  )
}
