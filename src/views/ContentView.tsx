import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Copy, 
  Edit, 
  Archive,
  Trash2,
  Download,
  Sparkles,
  ChevronDown,
  ArrowUpDown,
  MessageSquare
} from 'lucide-react';
import { cn } from '../lib/utils';

type ChannelType = 'WhatsApp' | 'SMS' | 'RCS';
type TemplateStatus = 'Active' | 'Draft' | 'Archived';
type TemplateType = 'Urgency' | 'Benefit' | 'Reminder' | 'Nudge' | 'Offer';

interface Template {
  id: string;
  name: string;
  type: TemplateType;
  preview: string;
  performance: string;
  campaignsCount: number;
  status: TemplateStatus;
  lastModified: string;
  channel: ChannelType;
}

const initialTemplates: Template[] = [
  { id: 'WA_PL_001', name: 'PL Urgency - Evening', type: 'Urgency', preview: '⚡ Complete your application in 2 hours...', performance: '18.4%', campaignsCount: 3, status: 'Active', lastModified: 'Apr 12', channel: 'WhatsApp' },
  { id: 'WA_PL_002', name: 'PL Benefit - EMI', type: 'Benefit', preview: '💰 EMI starting at ₹1,499/month...', performance: '14.2%', campaignsCount: 2, status: 'Active', lastModified: 'Apr 10', channel: 'WhatsApp' },
  { id: 'WA_PL_003', name: 'PL Reminder - Gentle', type: 'Reminder', preview: '📝 You left your application incomplete...', performance: '9.8%', campaignsCount: 1, status: 'Draft', lastModified: 'Apr 14', channel: 'WhatsApp' },
  { id: 'WA_DORMANT_001', name: 'Dormant Reactivation', type: 'Urgency', preview: '🏆 You\'re eligible for pre-approved offer...', performance: '22.1%', campaignsCount: 0, status: 'Active', lastModified: 'Apr 08', channel: 'WhatsApp' },
  { id: 'WA_FLASH_001', name: 'Flash Sale - Limited', type: 'Urgency', preview: '⏰ Flash sale ends today! Apply now...', performance: '26.3%', campaignsCount: 2, status: 'Active', lastModified: 'Apr 05', channel: 'WhatsApp' },
  // SMS Examples
  { id: 'SMS_PL_001', name: 'SMS Urgency', type: 'Urgency', preview: 'Final call! Your loan offer expires...', performance: '10.2%', campaignsCount: 1, status: 'Active', lastModified: 'Apr 11', channel: 'SMS' },
  { id: 'SMS_RE_001', name: 'SMS Reminder', type: 'Reminder', preview: 'Don\'t forget to finish your application...', performance: '6.5%', campaignsCount: 1, status: 'Active', lastModified: 'Apr 09', channel: 'SMS' },
  // RCS Examples
  { id: 'RCS_PL_001', name: 'RCS Rich Offer', type: 'Offer', preview: 'Check out these exclusive rates...', performance: '15.8%', campaignsCount: 1, status: 'Active', lastModified: 'Apr 13', channel: 'RCS' },
];

interface ContentViewProps {
  activeChannel: ChannelType;
  onChannelChange: (channel: any) => void;
}

export default function ContentView({ activeChannel, onChannelChange }: ContentViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TemplateType | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<TemplateStatus | 'All'>('All');

  const filteredTemplates = initialTemplates.filter(t => {
    const channelMatch = t.channel === activeChannel;
    const searchMatch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const typeMatch = typeFilter === 'All' || t.type === typeFilter;
    const statusMatch = statusFilter === 'All' || t.status === statusFilter;
    return channelMatch && searchMatch && typeMatch && statusMatch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-gray-900">Content Studio</h2>
        <p className="text-gray-500">Manage templates for AI decisioning and copilot generation</p>
      </div>

      {/* Channel Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {['WhatsApp', 'SMS', 'RCS'].map((ch) => (
          <button
            key={ch}
            onClick={() => onChannelChange(ch as ChannelType)}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-semibold transition-all",
              activeChannel === ch 
                ? "bg-white text-brand-orange shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {ch}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {/* Action Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-all">
              <Plus className="w-4 h-4" />
              Create New Template
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all">
              <Download className="w-4 h-4" />
              Bulk Import
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-brand-orange border border-orange-100 rounded-xl text-sm font-bold hover:bg-orange-100 transition-all">
            <Sparkles className="w-4 h-4" />
            Content Copilot
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 bg-white p-4 border border-gray-200 rounded-2xl shadow-sm">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Template Name or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-300 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Type:</span>
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-300 outline-none"
            >
              <option value="All">All Types</option>
              <option value="Urgency">Urgency</option>
              <option value="Benefit">Benefit</option>
              <option value="Reminder">Reminder</option>
              <option value="Nudge">Nudge</option>
              <option value="Offer">Offer</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Status:</span>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-300 outline-none"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-bold text-gray-400 uppercase">Sort by:</span>
            <button className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-brand-orange transition-colors">
              Last Modified <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Template ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Template Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Content Preview</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Performance (CTR)</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Used In</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Last Modified</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTemplates.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 text-sm tabular-nums text-gray-500">{t.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{t.name}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                      t.type === 'Urgency' ? "bg-red-50 text-red-600" :
                      t.type === 'Benefit' ? "bg-green-50 text-green-600" :
                      t.type === 'Reminder' ? "bg-orange-50 text-brand-orange" :
                      "bg-gray-100 text-gray-600"
                    )}>
                      {t.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate italic">
                    "{t.preview}"
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-brand-orange">
                      {t.performance}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {t.campaignsCount} campaigns
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                      t.status === 'Active' ? "bg-green-50 text-green-700 border-green-100" :
                      t.status === 'Draft' ? "bg-gray-50 text-gray-500 border-gray-100" :
                      "bg-amber-50 text-amber-700 border-amber-100"
                    )}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{t.lastModified}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-all" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-all" title="Duplicate">
                        <Copy className="w-4 h-4" />
                      </button>
                      {t.status === 'Draft' ? (
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <button className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Archive">
                          <Archive className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTemplates.length === 0 && (
            <div className="p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No templates found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
