import React, { useState } from 'react';
import { 
  Eye, 
  ArrowUpRight, 
  TrendingUp, 
  ChevronDown,
  MessageSquare,
  Sparkles,
  Users,
  Zap,
  TrendingUp as LiftIcon,
  Search,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { SEGMENT_PERFORMANCE_DATA } from '../constants';

interface SegmentsViewProps {
  onOpenCopilot?: (query?: string) => void;
}

type ViewMode = 'Standard' | 'Detailed';

export default function SegmentsView({ onOpenCopilot }: SegmentsViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('Standard');
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSegments = SEGMENT_PERFORMANCE_DATA.filter(s => 
    s.segmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.segmentId.toString().includes(searchQuery)
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Segment Performance</h1>
          <p className="text-gray-500 mt-1">Aggregated performance metrics by audience segment across all channels.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Filter segments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-300 outline-none transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => onOpenCopilot?.("Suggest ways to optimize segments with CTR < 1%")}
            className="flex items-center gap-2 px-6 py-2 bg-brand-orange text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            AI Optimization
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Active Segments", value: "142", sub: "Live across 3 channels", icon: Users, color: "text-brand-orange" },
          { label: "Total Published", value: "1.2M", sub: "+5% from last week", icon: Zap, color: "text-purple-600" },
          { label: "Avg Platform CTR", value: "2.4%", sub: "Above industry avg", icon: LiftIcon, color: "text-green-600" },
          { label: "Total Cost (MTD)", value: "₹4.2L", sub: "Budget utilized 42%", icon: LiftIcon, color: "text-amber-600" },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{stat.label}</p>
            <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Segments Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-200">
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Segment ID</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Segment Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Channel</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Published</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Sent</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Delivered</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg CTR</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Cost</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSegments.map((s, i) => (
              <tr 
                key={i} 
                className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                onClick={() => onOpenCopilot?.(`Analyze performance for segment ${s.segmentName}`)}
              >
                <td className="px-6 py-5 text-sm tabular-nums text-gray-500">{s.segmentId}</td>
                <td className="px-6 py-5">
                  <div className="text-sm font-bold text-gray-900 group-hover:text-brand-orange transition-colors">{s.segmentName}</div>
                </td>
                <td className="px-6 py-5 uppercase">
                  <span className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold",
                    s.channel === 'WhatsApp' ? "bg-green-50 text-green-700" :
                    s.channel === 'SMS' ? "bg-orange-50 text-orange-700" : "bg-purple-50 text-purple-700"
                  )}>
                    {s.channel}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm tabular-nums text-gray-600">{s.totalPublished.toLocaleString()}</td>
                <td className="px-6 py-5 text-sm tabular-nums text-gray-600">{s.totalSent.toLocaleString()}</td>
                <td className="px-6 py-5 text-sm tabular-nums text-gray-600">{s.totalDelivered.toLocaleString()}</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-bold text-gray-900">{s.avgCtr}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm font-bold text-gray-900">{s.totalCost}</td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-brand-orange hover:bg-orange-50 rounded-lg transition-all flex items-center gap-1 text-[10px] font-bold">
                      ANALYZE <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Copilot Suggestions for this view */}
      <div className="space-y-3">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Ask Copilot about Segments</p>
        <div className="flex flex-wrap gap-2 px-2">
          {[
            "Show me top 10 segments by CTR",
            "Which segment has the highest delivery rate?",
            "Compare WhatsApp vs SMS performance for similar segments",
            "Show segments with cost > ₹10,000"
          ].map(prompt => (
            <button 
              key={prompt}
              onClick={() => onOpenCopilot?.(prompt)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:border-orange-300 hover:text-brand-orange transition-all shadow-sm"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
