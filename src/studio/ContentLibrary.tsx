import React, { useState } from 'react'
import { Search, ArrowUpDown, ArrowUp, ArrowDown, BookOpen } from 'lucide-react'
import { mockLibrary, LibraryEntry } from './mockData'
import StatusBadge from './StatusBadge'
import ScorePill from './ScorePill'

interface ContentLibraryProps {
  onOpenEntry: (id: number) => void
}

const filterOptions: Record<string, { label: string; opts: string[] }> = {
  channel:  { label: 'All Channels',   opts: ['All', 'Push'] },
  category: { label: 'All Categories', opts: ['All', 'Promotional', 'BAU', 'Lifecycle', 'Retention'] },
  useCase:  { label: 'All Use Cases',  opts: ['All', 'Loan', 'FD', 'Insurance', 'Mutual Fund', 'Credit Card', 'App Re-engagement'] },
  source:   { label: 'All Sources',    opts: ['All', 'Brief', 'Workshop'] },
}

type SortField = keyof LibraryEntry
type SortDir = 'asc' | 'desc'

interface SortableHeaderProps {
  label: string
  field: SortField
  sortField: SortField
  sortDir: SortDir
  onSort: (field: SortField) => void
}

function SortableHeader({ label, field, sortField, sortDir, onSort }: SortableHeaderProps) {
  const active = sortField === field
  return (
    <button className="flex items-center gap-1 group" onClick={() => onSort(field)}>
      <span>{label}</span>
      <span className={`transition-colors ${active ? 'text-gray-900' : 'text-gray-200 group-hover:text-gray-400'}`}>
        {active && sortDir === 'asc' ? <ArrowUp size={11} strokeWidth={2.5} /> :
         active && sortDir === 'desc' ? <ArrowDown size={11} strokeWidth={2.5} /> :
         <ArrowUpDown size={11} strokeWidth={2} />}
      </span>
    </button>
  )
}

export default function ContentLibrary({ onOpenEntry }: ContentLibraryProps) {
  const [filters, setFilters] = useState({ channel: 'All', category: 'All', useCase: 'All', source: 'All' })
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<SortField>('approvedOn')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const setFilter = (key: string, val: string) => setFilters((f) => ({ ...f, [key]: val }))

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortField(field); setSortDir('asc') }
  }

  const filtered = mockLibrary
    .filter((e) => {
      if (filters.channel !== 'All' && e.channel !== filters.channel) return false
      if (filters.category !== 'All' && e.category !== filters.category) return false
      if (filters.useCase !== 'All' && e.useCase !== filters.useCase) return false
      if (filters.source !== 'All' && e.source !== filters.source) return false
      if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      let va: string | number = a[sortField] as string | number
      let vb: string | number = b[sortField] as string | number
      if (sortField === 'score') { va = Number(va); vb = Number(vb) }
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  const chevronSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236B7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-[28px] font-bold text-gray-900" style={{ letterSpacing: '-0.02em' }}>Content Library</h1>
            <span className="bg-gray-100 text-gray-500 text-[12px] font-semibold px-2.5 py-0.5 rounded-full border border-gray-200">
              {mockLibrary.length} entries
            </span>
          </div>
          <p className="text-[14px] text-gray-400">All approved push notification content, ready for export and re-use.</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {Object.entries(filterOptions).map(([key, { label, opts }]) => (
          <select
            key={key}
            value={filters[key as keyof typeof filters]}
            onChange={(e) => setFilter(key, e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-[12px] text-gray-900 focus:outline-none focus:border-gray-400 appearance-none cursor-pointer"
            style={{ backgroundImage: chevronSvg, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: '28px' }}
          >
            {opts.map((o) => <option key={o} value={o}>{o === 'All' ? label : o}</option>)}
          </select>
        ))}
        <div className="relative ml-auto">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search entries…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-[12px] bg-white focus:outline-none focus:border-gray-400 w-52"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto shadow-sm">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
              <BookOpen size={20} className="text-gray-400" strokeWidth={1.5} />
            </div>
            <p className="text-[14px] font-semibold text-gray-900">No results</p>
            <p className="text-[13px] text-gray-400">Try adjusting your filters or search.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  <SortableHeader label="Entry Name" field="name" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">Channel</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">Category</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">Use Case</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">Segment</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  <SortableHeader label="Score" field="score" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  <SortableHeader label="Approved On" field="approvedOn" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">Source</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, i) => (
                <tr
                  key={entry.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors group ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}
                >
                  <td className="px-4 py-3.5 max-w-[200px]">
                    <span className="text-[13px] font-medium text-gray-900 truncate block">{entry.name}</span>
                  </td>
                  <td className="px-4 py-3.5"><StatusBadge status={entry.channel} /></td>
                  <td className="px-4 py-3.5 text-[13px] text-gray-500">{entry.category}</td>
                  <td className="px-4 py-3.5 text-[13px] text-gray-500">{entry.useCase}</td>
                  <td className="px-4 py-3.5 text-[13px] text-gray-500">{entry.segment}</td>
                  <td className="px-4 py-3.5"><ScorePill score={entry.score} /></td>
                  <td className="px-4 py-3.5 text-[12px] text-gray-400 whitespace-nowrap">{entry.approvedOn}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={entry.source} /></td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => onOpenEntry(entry.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 text-[12px] font-semibold border border-gray-200 rounded-lg hover:border-gray-900 hover:text-gray-900 text-gray-500 bg-white"
                    >
                      View
                    </button>
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
