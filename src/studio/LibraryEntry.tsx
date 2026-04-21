import React, { useState, useRef } from 'react'
import { ArrowLeft, Copy, Download, Check, Pencil } from 'lucide-react'
import { mockLibrary } from './mockData'
import StatusBadge from './StatusBadge'
import ScorePill from './ScorePill'
import DevicePreview from './DevicePreview'

interface LibraryEntryProps {
  id: number
  onBack: () => void
}

export default function LibraryEntry({ id, onBack }: LibraryEntryProps) {
  const entry = mockLibrary.find((e) => e.id === id) || mockLibrary[0]

  const [name, setName] = useState(entry.name)
  const [editingName, setEditingName] = useState(false)
  const [copiedTitle, setCopiedTitle] = useState(false)
  const [copiedBody, setCopiedBody] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)

  const handleNameClick = () => {
    setEditingName(true)
    setTimeout(() => nameRef.current?.focus(), 0)
  }

  const handleNameBlur = () => setEditingName(false)

  const handleCopy = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setter(true)
    setTimeout(() => setter(false), 2000)
  }

  const handleDownloadCSV = () => {
    const csv = `Entry Name,Channel,Category,Use Case,Segment,Score,Approved On,Source,Title,Body\n"${name}","${entry.channel}","${entry.category}","${entry.useCase}","${entry.segment}",${entry.score},"${entry.approvedOn}","${entry.source}","${entry.title}","${entry.body}"`
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name.replace(/\s+/g, '_')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex h-full">
      {/* Left panel */}
      <div className="w-[360px] flex-shrink-0 border-r border-gray-100 bg-white flex flex-col h-full overflow-y-auto">
        <div className="p-6 flex flex-col gap-5 flex-1">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-900 transition-colors w-fit"
          >
            <ArrowLeft size={14} />
            Content Library
          </button>

          {/* Editable name */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Entry Name</p>
            {editingName ? (
              <input
                ref={nameRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleNameBlur}
                className="w-full border border-gray-900 rounded-lg px-3 py-2 text-[14px] font-bold text-gray-900 focus:outline-none"
              />
            ) : (
              <button
                onClick={handleNameClick}
                className="flex items-start gap-2 group text-left w-full"
              >
                <span className="text-[15px] font-bold text-gray-900 leading-snug">{name}</span>
                <Pencil size={13} className="text-gray-400 mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3.5">
            {[
              { label: 'Channel',     value: <StatusBadge status={entry.channel} /> },
              { label: 'Category',    value: <span className="text-[13px] text-gray-900">{entry.category}</span> },
              { label: 'Use Case',    value: <span className="text-[13px] text-gray-900">{entry.useCase}</span> },
              { label: 'Segment',     value: <span className="text-[13px] text-gray-900">{entry.segment}</span> },
              { label: 'Source',      value: <StatusBadge status={entry.source} /> },
              { label: 'Approved On', value: <span className="text-[13px] text-gray-900">{entry.approvedOn}</span> },
              { label: 'AI Score',    value: <ScorePill score={entry.score} /> },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
                {value}
              </div>
            ))}
          </div>
        </div>

        {/* Export actions */}
        <div className="p-6 border-t border-gray-100 flex flex-col gap-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1">Export</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleCopy(entry.title, setCopiedTitle)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[12px] font-semibold border border-gray-200 rounded-lg hover:border-gray-400 transition-colors"
            >
              {copiedTitle ? <Check size={13} className="text-green-700" /> : <Copy size={13} />}
              {copiedTitle ? 'Copied ✓' : 'Copy Title'}
            </button>
            <button
              onClick={() => handleCopy(entry.body, setCopiedBody)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[12px] font-semibold border border-gray-200 rounded-lg hover:border-gray-400 transition-colors"
            >
              {copiedBody ? <Check size={13} className="text-green-700" /> : <Copy size={13} />}
              {copiedBody ? 'Copied ✓' : 'Copy Body'}
            </button>
          </div>
          <button
            onClick={handleDownloadCSV}
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-orange text-white rounded-lg text-[13px] font-semibold hover:bg-orange-600 transition-colors"
          >
            <Download size={14} />
            Download CSV
          </button>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[18px] font-bold text-gray-900" style={{ letterSpacing: '-0.01em' }}>Content Preview</h2>
            <span className="flex items-center gap-1.5 bg-green-100 text-green-700 text-[12px] font-bold px-3 py-1 rounded-full">
              <Check size={12} strokeWidth={2.5} />
              Approved
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Title</label>
                <span className="text-[10px] text-gray-400 tabular-nums">
                  {entry.title?.length}/50 iOS · {entry.title?.length}/65 Android
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg px-4 py-3 text-[14px] font-semibold text-gray-900 border border-gray-100">
                {entry.title}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Body</label>
                <span className="text-[10px] text-gray-400 tabular-nums">{entry.body?.length}/240</span>
              </div>
              <div className="bg-gray-50 rounded-lg px-4 py-3 text-[13px] text-gray-700 leading-relaxed border border-gray-100">
                {entry.body}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            <div className="flex justify-center py-2">
              <DevicePreview title={entry.title} body={entry.body} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
