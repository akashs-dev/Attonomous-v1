import React, { useState, useEffect } from 'react'
import { ArrowLeft, RefreshCw, Check, AlertTriangle, Sparkles, Pencil } from 'lucide-react'
import { campaignCategories, useCases, segments, mockVariants, Variant } from './mockData'
import ScorePill, { simulateScore } from './ScorePill'
import DevicePreview from './DevicePreview'

// ── Simple keyword detection (simulates AI) ──────────────────────────────────
function detectCategory(t: string): string {
  const s = t.toLowerCase()
  if (s.includes('re-engag') || s.includes('lapsed') || s.includes('reactivat')) return 'Retention'
  if (s.includes('remind') || s.includes('renewal') || s.includes('lifecycle')) return 'Lifecycle'
  if (s.includes('acqui') || s.includes('new customer')) return 'Acquisition'
  return 'Promotional'
}
function detectUseCase(t: string): string {
  const s = t.toLowerCase()
  if (s.includes('insurance') || s.includes('term cover') || s.includes('policy')) return 'Insurance'
  if (s.includes('mutual fund') || s.includes('sip') || s.includes('invest')) return 'Mutual Fund'
  if (s.includes('credit card')) return 'Credit Card'
  if (s.includes(' fd ') || s.includes('fixed deposit')) return 'FD'
  if (s.includes('re-engag') || s.includes('lapsed') || s.includes('inactive')) return 'App Re-engagement'
  if (s.includes('loan') || s.includes('borrow') || s.includes('emi')) return 'Loan'
  return 'Loan'
}
function detectSegment(t: string): string {
  const s = t.toLowerCase()
  if (s.includes('retir') || s.includes('senior')) return 'Retiree'
  if (s.includes('young') || s.includes('professional')) return 'Young Professional'
  if (s.includes('lapsed') || s.includes('inactive')) return 'Lapsed User'
  if (s.includes('hni') || s.includes('high net')) return 'HNI'
  if (s.includes('investor')) return 'Aspiring Investor'
  return 'First-Time Borrower'
}

// ── Chip type ─────────────────────────────────────────────────────────────────
interface Chip {
  key: string
  label: string
  locked?: boolean
}

// ── Editable taxonomy chip ────────────────────────────────────────────────────
interface TaxonomyChipProps {
  chip: Chip
  animIndex: number
  onUpdate: (key: string, label: string) => void
}

function TaxonomyChip({ chip, animIndex, onUpdate }: TaxonomyChipProps) {
  const [editing, setEditing] = useState(false)
  const optionMap: Record<string, string[]> = {
    category: campaignCategories,
    useCase: useCases,
    segment: segments,
  }

  const style: React.CSSProperties = {
    animation: 'chipPop 220ms ease forwards',
    animationDelay: `${animIndex * 60}ms`,
    opacity: 0,
  }

  if (chip.locked) {
    return (
      <span
        style={style}
        className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-100 px-3 py-1.5 rounded-full text-[12px] font-semibold"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
        {chip.label}
      </span>
    )
  }

  if (editing) {
    return (
      <select
        autoFocus
        value={chip.label}
        onChange={(e) => { onUpdate(chip.key, e.target.value); setEditing(false) }}
        onBlur={() => setEditing(false)}
        className="border border-gray-900 rounded-full px-3 py-1.5 text-[12px] font-semibold bg-white focus:outline-none cursor-pointer"
      >
        {(optionMap[chip.key] || []).map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    )
  }

  return (
    <button
      style={style}
      onClick={() => setEditing(true)}
      className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-900 px-3 py-1.5 rounded-full text-[12px] font-semibold hover:border-gray-900 transition-colors group"
    >
      {chip.label}
      <Pencil size={10} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
    </button>
  )
}

// ── Variant card ──────────────────────────────────────────────────────────────
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
    setTimeout(() => setRegenerating(false), 1500)
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
            <p className="text-[12px] text-amber-800">
              <span className="font-semibold">Compliance warning</span> — review restricted claims before approving.
            </p>
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

// ── Generated panel (two-column) ─────────────────────────────────────────────
interface GeneratedPanelProps {
  chips: Chip[]
  prompt: string
  variantCount: number
  onBack: () => void
  onViewLibrary: () => void
}

function GeneratedPanel({ chips, prompt, variantCount, onBack, onViewLibrary }: GeneratedPanelProps) {
  const [variants, setVariants] = useState<Variant[] | null>(null)
  const [generating, setGenerating] = useState(true)
  const [approvedId, setApprovedId] = useState<number | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => { setVariants(mockVariants); setGenerating(false) }, 2000)
    return () => clearTimeout(t)
  }, [])

  const handleRegenerate = () => {
    setGenerating(true); setApprovedId(null); setShowSuccess(false)
    setTimeout(() => { setVariants(mockVariants); setGenerating(false) }, 2000)
  }

  return (
    <div className="flex h-full">
      {/* Left panel */}
      <div className="w-[360px] flex-shrink-0 border-r border-gray-100 bg-white flex flex-col h-full overflow-y-auto">
        <div className="p-6 flex flex-col gap-5 flex-1">
          <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-900 transition-colors w-fit">
            <ArrowLeft size={14} /> Workshop
          </button>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Workshop session</span>
            <h1 className="text-[16px] font-bold text-gray-900 mt-1 leading-snug">
              {chips.find(c => c.key === 'category')?.label} · {chips.find(c => c.key === 'useCase')?.label}
            </h1>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Channel', value: 'Push Notification' },
              { label: 'Category', value: chips.find(c => c.key === 'category')?.label },
              { label: 'Use Case', value: chips.find(c => c.key === 'useCase')?.label },
              { label: 'Segment', value: chips.find(c => c.key === 'segment')?.label },
              { label: 'Variants', value: String(variantCount) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
                <p className="text-[13px] text-gray-900">{value}</p>
              </div>
            ))}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Brief</p>
              <p className="text-[13px] text-gray-700 leading-relaxed">{prompt}</p>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-100">
          <button onClick={handleRegenerate} disabled={generating}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#C8E6C9] text-[#1B5E20] rounded-xl text-[14px] font-bold hover:bg-[#A5D6A7] transition-colors disabled:opacity-50">
            <RefreshCw size={15} /> Regenerate
          </button>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {showSuccess && (
          <div className="mb-4 flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <Check size={16} className="text-green-700" strokeWidth={2.5} />
            <p className="text-[13px] font-semibold text-green-800 flex-1">Content approved and saved to library</p>
            <button onClick={onViewLibrary} className="text-[12px] font-semibold text-green-700 underline underline-offset-2">
              View Library
            </button>
          </div>
        )}
        {generating ? (
          <div className="flex flex-col gap-4">
            <p className="text-[13px] font-medium text-gray-400 text-center mb-2 animate-pulse flex items-center justify-center gap-2">
              <Sparkles size={14} /> Generating your variants…
            </p>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 shadow-sm animate-pulse">
                <div className="flex justify-between"><div className="h-4 w-20 bg-gray-100 rounded" /><div className="h-6 w-10 bg-gray-100 rounded-full" /></div>
                <div className="h-10 bg-gray-100 rounded-lg" /><div className="h-24 bg-gray-100 rounded-lg" /><div className="h-48 bg-gray-100 rounded-xl" /><div className="h-10 bg-gray-100 rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-[13px] font-semibold text-gray-900 mb-2">
              {(variants || mockVariants).length} variants generated
              {approvedId && <span className="text-green-700 ml-2">· 1 approved</span>}
            </p>
            {(variants || mockVariants).map((v, i) => (
              <VariantCard
                key={v.id} variant={v} index={i}
                onApprove={(id) => { setApprovedId(id); setShowSuccess(true) }}
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

// ── Main Workshop setup form (V2 — prompt-first) ──────────────────────────────
interface WorkshopSetupProps {
  onViewLibrary: () => void
}

export default function WorkshopSetup({ onViewLibrary }: WorkshopSetupProps) {
  const [prompt, setPrompt] = useState('')
  const [chips, setChips] = useState<Chip[] | null>(null)
  const [detecting, setDetecting] = useState(false)
  const [variantCount, setVariantCount] = useState(3)
  const [generated, setGenerated] = useState(false)
  const [finalChips, setFinalChips] = useState<Chip[] | null>(null)

  useEffect(() => {
    if (prompt.trim().length < 15) {
      setChips(null); setDetecting(false); return
    }
    setDetecting(true)
    const timer = setTimeout(() => {
      setChips([
        { key: 'channel', label: 'Push', locked: true },
        { key: 'category', label: detectCategory(prompt) },
        { key: 'useCase', label: detectUseCase(prompt) },
        { key: 'segment', label: detectSegment(prompt) },
      ])
      setDetecting(false)
    }, 800)
    return () => { clearTimeout(timer); setDetecting(false) }
  }, [prompt])

  const updateChip = (key: string, label: string) => {
    setChips((prev) => prev ? prev.map((c) => (c.key === key ? { ...c, label } : c)) : prev)
  }

  const handleGenerate = () => {
    setFinalChips(chips)
    setGenerated(true)
  }

  if (generated && finalChips) {
    return (
      <GeneratedPanel
        chips={finalChips}
        prompt={prompt}
        variantCount={variantCount}
        onBack={() => setGenerated(false)}
        onViewLibrary={onViewLibrary}
      />
    )
  }

  const canGenerate = prompt.trim().length >= 15

  return (
    <div className="flex items-center justify-center min-h-full px-8 py-12">
      <div className="w-full max-w-[640px]">
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-bold text-gray-900 mb-1.5" style={{ letterSpacing: '-0.02em' }}>
            What should we say?
          </h1>
          <p className="text-[14px] text-gray-400">Describe your campaign. We'll handle the rest.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
          {/* Big prompt textarea */}
          <div>
            <textarea
              rows={5}
              placeholder="e.g. Drive loan applications from first-time borrowers aged 25–35. Urgent, youth-friendly tone, mention instant approval and zero paperwork…"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] text-gray-900 resize-none focus:outline-none focus:border-gray-400 transition-colors placeholder-gray-300 leading-relaxed"
            />
            <div className="flex items-center justify-between mt-1.5 px-1">
              <span className="text-[11px] text-gray-400">
                {prompt.length < 15 && prompt.length > 0
                  ? `${15 - prompt.length} more characters to detect taxonomy`
                  : ''}
              </span>
              <span className="text-[11px] text-gray-400 tabular-nums">{prompt.length}/500</span>
            </div>
          </div>

          {/* AI detection row */}
          <div className="min-h-[36px] flex items-center">
            {detecting && (
              <div className="flex items-center gap-2 text-[12px] text-gray-400">
                <span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                Detecting taxonomy…
              </div>
            )}
            {!detecting && chips && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-gray-400 font-medium">Detected:</span>
                {chips.map((chip, i) => (
                  <TaxonomyChip key={chip.key} chip={chip} animIndex={i} onUpdate={updateChip} />
                ))}
                <span className="text-[10px] text-gray-400 ml-1">· tap to edit</span>
              </div>
            )}
            {!detecting && !chips && prompt.length === 0 && (
              <span className="text-[12px] text-gray-400">Taxonomy will be auto-detected as you type.</span>
            )}
          </div>

          <div className="h-px bg-gray-100" />

          {/* Variant count + Generate */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Variants</span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setVariantCount(n)}
                    className={`w-8 h-8 rounded-lg text-[13px] font-bold transition-all duration-150
                      ${n <= variantCount
                        ? 'bg-gray-900 text-white'
                        : 'border border-dashed border-gray-200 text-gray-400 hover:border-gray-900 hover:text-gray-900'
                      }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1" />
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="flex items-center gap-2 px-8 py-3 bg-[#C8E6C9] text-[#1B5E20] rounded-xl text-[14px] font-bold hover:bg-[#A5D6A7] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Sparkles size={15} />
              Generate {variantCount} variant{variantCount !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
