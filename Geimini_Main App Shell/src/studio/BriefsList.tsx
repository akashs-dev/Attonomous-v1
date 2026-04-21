import React, { useState } from 'react'
import { Search, Inbox } from 'lucide-react'
import { mockBriefs } from './mockData'
import StatusBadge from './StatusBadge'

interface BriefsListProps {
  onOpenBrief: (id: number) => void
}

const statusOptions = ['All', 'Pending', 'In Progress', 'Approved']

export default function BriefsList({ onOpenBrief }: BriefsListProps) {
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const pendingCount = mockBriefs.filter((b) => b.status === 'Pending').length

  const filtered = mockBriefs.filter((b) => {
    const matchStatus = filterStatus === 'All' || b.status === filterStatus
    const matchSearch = !searchQuery ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.useCase.toLowerCase().includes(searchQuery.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Briefs</h1>
            {pendingCount > 0 && (
              <span className="bg-orange-100 text-orange-700 text-[12px] font-bold px-2.5 py-0.5 rounded-full">
                {pendingCount} pending
              </span>
            )}
          </div>
          <p className="text-gray-500">Content briefs from the Decisioning agent awaiting your review.</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search briefs…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-[13px] bg-white focus:outline-none focus:border-gray-400 w-56"
          />
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors
                ${filterStatus === s
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-900'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
              <Inbox size={24} className="text-gray-400" strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <p className="text-[15px] font-semibold text-gray-900 mb-1">No briefs</p>
              <p className="text-[13px] text-gray-500">No pending briefs at the moment.</p>
            </div>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Brief Name', 'Category', 'Use Case', 'Segment', 'Received', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((brief, i) => (
                <tr
                  key={brief.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors group ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}
                >
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] font-medium text-gray-900">{brief.name}</span>
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-gray-500">{brief.category}</td>
                  <td className="px-4 py-3.5 text-[13px] text-gray-500">{brief.useCase}</td>
                  <td className="px-4 py-3.5 text-[13px] text-gray-500">{brief.segment}</td>
                  <td className="px-4 py-3.5 text-[12px] text-gray-400 whitespace-nowrap">{brief.received}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={brief.status} /></td>
                  <td className="px-4 py-3.5">
                    {brief.status !== 'Approved' ? (
                      <button
                        onClick={() => onOpenBrief(brief.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 text-[12px] font-semibold border border-gray-200 rounded-lg hover:border-gray-900 hover:text-gray-900 text-gray-500 bg-white"
                      >
                        Open
                      </button>
                    ) : (
                      <span className="text-[12px] text-green-600 font-medium">✓ Done</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
