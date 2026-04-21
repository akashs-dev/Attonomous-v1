import React, { useState, useEffect } from 'react'
import { ArrowLeft, RefreshCw, Check, AlertTriangle, Sparkles } from 'lucide-react'
import { mockBriefs, mockVariants, Variant } from './mockData'
import ScorePill, { simulateScore } from './ScorePill'
import StatusBadge from './StatusBadge'
import DevicePreview from './DevicePreview'

interface BriefDetailProps {
  id: number
  onBack: () => void
  onApproved: () => void
}

interface VariantCardProps {
  variant: Variant
  index: number
  onApprove: (id: number) => void
  isApproved: boolean
  isDimmed: boolean
}

function VariantCard({ variant, index, onApprove, isApproved, isDimmed }: VariantCardProps) {
  const [title, setTitle] = useState(variant.title)
  const [body, setBody] = useState(variant.body)
  const [score, setScore] = useState(variant.score)
  const [regenerating, setRegenerating] = useState(false)

  useEffect(() => { setScore(simulateScore(title, body)) }, [title, body])

  const handleRegenerate = () => {
    setRegenerating(true)
    setTimeout(() => { setTitle(variant.title); setBody(variant.body); setRegenerating(false) }, 1500)
  }

  const entranceStyle: React.CSSProperties = {
    animation: 'studioSlideUp 250ms ease forwards',
    animationDelay: `${index * 80}ms`,
    opacity: 0,
  }

  if (regenerating) {
    return (
      <div style={entranceStyle} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 shadow-sm animate-pulse">
        <div className="flex justify-between"><div className="h-4 w-20 bg-gray-100 rounded" /><div className="h-6 w-10 bg-gray-100 rounded-full" /></div>
        <div className="h-10 bg-gray-100 rounded-lg" /><div className="h-24 bg-gray-100 rounded-lg" /><div className="h-48 bg-gray-100 rounded-xl" />
        <p className="text-[12px] text-gray-400 text-center">Regenerating variant…</p>
      </div>
    )
  }

  return (
    <div
      style={{
        ...entranceStyle,
        maxHeight: isDimmed ? '64px' : '2000px',
        transition: 'max-height 350ms ease, opacity 250ms ease',
      }}
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden
        ${isApproved ? 'border-green-300 bg-green-50' : isDimmed ? 'border-gray-100 opacity-40' : 'border-gray-100'}`}
    >
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold uppercase tracking-widest text-gray-400">Variant {index + 1}</span>
          <ScorePill score={score} />
        </div>

        {variant.hasWarning && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5">
            <AlertTriangle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
            <p className="text-[12px] text-amber-800"><span className="font-semibold">Compliance warning</span> — "Guaranteed" and "100%" are restricted claims.</p>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Title</label>
            <span className="text-[10px] text-gray-400 tabular-nums">{title.length}/50 iOS · {title.length}/65 Android</span>
          </div>
          <textarea value={title} onChange={(e) => setTitle(e.target.value)} rows={2} maxLength={65}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 resize-none focus:outline-none focus:border-gray-400 bg-white" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Body</label>
            <span className="text-[10px] text-gray-400 tabular-nums">{body.length}/240</span>
          </div>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} maxLength={240}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 resize-none focus:outline-none focus:border-gray-400 bg-white" />
        </div>

        <div className="flex justify-center py-2">
          <DevicePreview title={title} body={body} />
        </div>

        {isApproved ? (
          <div className="flex items-center justify-center gap-2 py-3 bg-green-100 rounded-xl">
            <Check size={16} className="text-green-700" strokeWidth={2.5} />
            <span className="text-[14px] font-bold text-green-700">Approved</span>
          </div>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleRegenerate}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-semibold border border-gray-200 rounded-lg hover:border-gray-400 transition-colors">
              <RefreshCw size={13} />Regenerate
            </button>
            <button onClick={() => onApprove(variant.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-semibold bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-colors">
              <Check size={13} />Approve
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BriefDetail({ id, onBack, onApproved }: BriefDetailProps) {
  const brief = mockBriefs.find((b) => b.id === id) || mockBriefs[0]
  const [generating, setGenerating] = useState(false)
  const [variants, setVariants] = useState<Variant[] | null>(null)
  const [approvedId, setApprovedId] = useState<number | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleGenerate = () => {
    setGenerating(true)
    setApprovedId(null)
    setShowSuccess(false)
    setTimeout(() => { setVariants(mockVariants); setGenerating(false) }, 2000)
  }

  const handleApprove = (variantId: number) => {
    setApprovedId(variantId)
    setShowSuccess(true)
  }

  return (
    <div className="flex h-full">
      {/* Left panel */}
      <div className="w-[360px] flex-shrink-0 border-r border-gray-100 bg-white flex flex-col h-full overflow-y-auto">
        <div className="p-6 flex flex-col gap-5 flex-1">
          <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-900 transition-colors w-fit">
            <ArrowLeft size={14} />Briefs
          </button>
          <div>
            <h1 className="text-[18px] font-bold text-gray-900 mb-2 leading-snug">{brief.name}</h1>
            <StatusBadge status={brief.status} />
          </div>
          <div className="flex flex-col gap-3.5">
            {[
              { label: 'Channel', value: 'Push Notification' },
              { label: 'Campaign Category', value: brief.category },
              { label: 'Use Case', value: brief.useCase },
              { label: 'Segment', value: brief.segment },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
                <p className="text-[13px] text-gray-900">{value}</p>
              </div>
            ))}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Objective</p>
              <p className="text-[13px] text-gray-700 leading-relaxed">{brief.objective}</p>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 block mb-1.5">
              Additional context <span className="normal-case font-normal">(optional)</span>
            </label>
            <textarea rows={3} placeholder="Add specific instructions…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 resize-none focus:outline-none focus:border-gray-400 placeholder-gray-300" />
          </div>
        </div>
        <div className="p-6 border-t border-gray-100">
          <button onClick={handleGenerate} disabled={generating}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#C8E6C9] text-[#1B5E20] rounded-xl text-[14px] font-bold hover:bg-[#A5D6A7] transition-colors disabled:opacity-50">
            <Sparkles size={15} />
            {variants ? 'Regenerate' : 'Generate'}
          </button>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {showSuccess && (
          <div className="mb-4 flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <Check size={16} className="text-green-700" strokeWidth={2.5} />
            <p className="text-[13px] font-semibold text-green-800 flex-1">Content approved and saved to library</p>
            <button onClick={onApproved} className="text-[12px] font-semibold text-green-700 underline underline-offset-2">View Library</button>
          </div>
        )}

        {!generating && !variants && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
              <Sparkles size={24} className="text-gray-300" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-gray-900 mb-1">Ready to generate</p>
              <p className="text-[13px] text-gray-400 max-w-xs">Configure the brief on the left and hit Generate to create content variants.</p>
            </div>
          </div>
        )}

        {generating && (
          <div className="flex flex-col gap-4">
            <p className="text-[13px] font-medium text-gray-400 text-center mb-2 animate-pulse flex items-center justify-center gap-2">
              <Sparkles size={14} />Generating your variants…
            </p>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 shadow-sm animate-pulse">
                <div className="flex justify-between"><div className="h-4 w-20 bg-gray-100 rounded" /><div className="h-6 w-10 bg-gray-100 rounded-full" /></div>
                <div className="h-10 bg-gray-100 rounded-lg" /><div className="h-24 bg-gray-100 rounded-lg" /><div className="h-48 bg-gray-100 rounded-xl" /><div className="h-10 bg-gray-100 rounded-lg" />
              </div>
            ))}
          </div>
        )}

        {!generating && variants && (
          <div className="flex flex-col gap-4">
            <p className="text-[13px] font-semibold text-gray-900 mb-2">
              {variants.length} variants generated
              {approvedId && <span className="text-green-600 ml-2">· 1 approved</span>}
            </p>
            {variants.map((v, i) => (
              <VariantCard key={v.id} variant={v} index={i}
                onApprove={handleApprove}
                isApproved={approvedId === v.id}
                isDimmed={approvedId !== null && approvedId !== v.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
