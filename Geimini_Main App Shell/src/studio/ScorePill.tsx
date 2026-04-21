import React from 'react'

export function simulateScore(title: string, body: string): number {
  const t = title.trim()
  const b = body.trim()
  let score = 55
  if (t.length >= 15 && t.length <= 50) score += 12
  if (b.length >= 30 && b.length <= 200) score += 12
  if (t.includes('₹') || b.includes('₹')) score += 6
  if (t.includes('%') || b.includes('%')) score += 4
  if (t.includes('!') || b.includes('Guaranteed') || b.includes('100%')) score -= 20
  if (b.length > 240) score -= 15
  if (t.length > 65) score -= 10
  return Math.max(10, Math.min(99, Math.round(score)))
}

export default function ScorePill({ score }: { score: number }) {
  let style = ''
  if (score >= 75) style = 'bg-green-100 text-green-700'
  else if (score >= 50) style = 'bg-amber-100 text-amber-800'
  else style = 'bg-red-100 text-red-800'

  return (
    <span className={`inline-flex items-center justify-center min-w-[40px] px-2.5 py-0.5 rounded-full text-[12px] font-bold tabular-nums ${style}`}>
      {score}
    </span>
  )
}
