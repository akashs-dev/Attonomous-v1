import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  RefreshCw, 
  Target, 
  Zap, 
  Pause, 
  Play,
  X,
  ChevronDown,
  Calendar,
  Brain,
  Rocket,
  Clock,
  Briefcase,
  AlertCircle,
  TrendingUp,
  History,
  Activity,
  FileText,
  Lock,
  ChevronRight,
  TrendingDown,
  Minus,
  Check,
  Download,
  Info,
  Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { 
  YESTERDAY_PERFORMANCE, 
  YESTERDAY_PARTNER_PERFORMANCE, 
  TOMORROW_CAMPAIGNS 
} from '../constants';
import { 
  Campaign, 
  ChannelType, 
  StrategyFocus,
  SelectionState
} from '../types';

interface CampaignsViewProps {
  subView: string;
  onSubViewChange: (sub: string) => void;
  activeChannel: ChannelType | 'All Channels';
  onChannelChange: (channel: ChannelType | 'All Channels') => void;
  onOpenCopilot?: (query?: string) => void;
  onSelectionChange?: (selection: SelectionState) => void;
  onSetupUseCase?: () => void;
}

type CampaignViewType = 'AI-Driven' | 'BFL Focus' | 'Top 5 Focus' | 'No Offer' | 'Reactivation';

export default function CampaignBundler({ subView, onSubViewChange, activeChannel, onChannelChange, onOpenCopilot, onSelectionChange, onSetupUseCase }: CampaignsViewProps) {
  const isEvening = useMemo(() => new Date().getHours() >= 16, []); // 4 PM onwards is "Evening"
  const timeContext = isEvening ? 'TOMORROW' : 'TODAY';
  const generationInfo = isEvening ? 'Generated just now' : 'Generated last night at 8 PM';

  // View State
  const [activeView, setActiveView] = useState<CampaignViewType>('AI-Driven');
  const [selectedPartnerNames, setSelectedPartnerNames] = useState<Set<string>>(new Set());
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<Set<string>>(new Set());
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<'selection' | 'quick' | 'template'>('selection');

  // Manual Campaign Form State
  const [manualFormData, setManualFormData] = useState({
    segment: '',
    conversion: 'Disbursal',
    template: '',
    startTime: '',
    endTime: '',
    budget: '5,00,000'
  });

  // Filtering Logic
  const filteredCampaigns = useMemo(() => {
    return TOMORROW_CAMPAIGNS.filter(c => {
      // First apply strategy view filter
      let matchesView = true;
      if (activeView === 'BFL Focus') matchesView = c.partner === 'BFL';
      else if (activeView === 'Top 5 Focus') matchesView = ['BFL', 'HDFC', 'ICICI', 'SBI', 'AXIS'].includes(c.partner);
      else if (activeView === 'No Offer') matchesView = c.isNoOffer === true;
      else if (activeView === 'Reactivation') matchesView = c.isReactivation === true;

      // Then apply channel filter
      const matchesChannel = activeChannel === 'All Channels' || c.channel === activeChannel;

      return matchesView && matchesChannel;
    });
  }, [activeView, activeChannel]);

  // Selection Logic Unified
  useEffect(() => {
    if (onSelectionChange) {
      const selectedCampaigns = TOMORROW_CAMPAIGNS.filter(c => selectedCampaignIds.has(c.id));
      onSelectionChange({
        partners: Array.from(selectedPartnerNames),
        campaigns: selectedCampaigns
      });
    }
  }, [selectedPartnerNames, selectedCampaignIds, onSelectionChange]);

  const handleTogglePartner = (name: string) => {
    const next = new Set(selectedPartnerNames);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    setSelectedPartnerNames(next);
  };

  const handleToggleCampaign = (id: string) => {
    const next = new Set(selectedCampaignIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedCampaignIds(next);
  };

  const handleSelectAllCampaigns = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedCampaignIds(new Set(filteredCampaigns.map(c => c.id)));
    } else {
      setSelectedCampaignIds(new Set());
    }
  };

  const handleSelectAllPartners = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPartnerNames(new Set(YESTERDAY_PARTNER_PERFORMANCE.map(p => p.partner)));
    } else {
      setSelectedPartnerNames(new Set());
    }
  };

  const totalEstSpend = useMemo(() => {
    const selected = filteredCampaigns.filter(c => selectedCampaignIds.has(c.id));
    const sum = selected.reduce((acc, curr) => acc + parseInt(curr.spend.replace('₹', '').replace(',', '')), 0);
    return sum.toLocaleString();
  }, [filteredCampaigns, selectedCampaignIds]);

  const top5Partners = ['BFL', 'HDFC', 'ICICI', 'SBI', 'AXIS'];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 pb-32">
      {/* SECTION 1: Daily Decisions Overview */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-gray-400" />
            Daily Decisions — Yesterday
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all shadow-sm">
            <RefreshCw className="w-3.5 h-3.5" />
            [Refresh]
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-[24px] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-4 w-12">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-brand-orange focus:ring-orange-300 cursor-pointer"
                    onChange={handleSelectAllPartners}
                    checked={selectedPartnerNames.size === YESTERDAY_PARTNER_PERFORMANCE.length && YESTERDAY_PARTNER_PERFORMANCE.length > 0}
                  />
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Partner</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Channel</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">AIP Volume</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">CPAIP</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Spend</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {YESTERDAY_PARTNER_PERFORMANCE.map((p, i) => (
                <tr key={i} className={cn(
                  "hover:bg-gray-50/50 transition-colors",
                  selectedPartnerNames.has(p.partner) && "bg-orange-50/30"
                )}>
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-brand-orange focus:ring-orange-300 cursor-pointer"
                      checked={selectedPartnerNames.has(p.partner)}
                      onChange={() => handleTogglePartner(p.partner)}
                    />
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-900">{p.partner}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border",
                      p.channel === 'WhatsApp' ? "bg-green-50 text-green-700 border-green-100" :
                      p.channel === 'SMS' ? "bg-orange-50 text-orange-700 border-orange-100" : "bg-purple-50 text-purple-700 border-purple-100"
                    )}>
                      {p.channel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs tabular-nums text-gray-600 text-right">{p.aipVolume.toLocaleString()}</td>
                  <td className="px-6 py-4 text-xs tabular-nums text-gray-900 text-right font-bold">{p.cpaip}</td>
                  <td className="px-6 py-4 text-xs tabular-nums text-gray-900 text-right">{p.spend}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-center gap-1.5">
                      {p.trendDirection === 'up' && <TrendingUp className="w-3.5 h-3.5 text-green-500" />}
                      {p.trendDirection === 'down' && <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
                      {p.trendDirection === 'neutral' && <Minus className="w-3.5 h-3.5 text-gray-400" />}
                      <span className={cn(
                        "text-[11px] font-bold",
                        p.trendDirection === 'up' ? "text-green-600" : 
                        p.trendDirection === 'down' ? "text-red-600" : "text-gray-500"
                      )}>
                        {p.trendDirection === 'up' ? `▲ ${p.trend}` : p.trendDirection === 'down' ? `▼ ${p.trend}` : `→ ${p.trend}`}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-6 bg-orange-50 border-t border-orange-100 flex items-center gap-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Brain className="w-5 h-5 text-brand-orange" />
            </div>
            <p className="text-sm font-medium text-gray-900">
              <span className="font-bold">💡 AI Insight:</span> {YESTERDAY_PERFORMANCE.aiInsight}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: Upcoming Campaigns */}
      <section className="space-y-8 pt-12 border-t border-gray-100">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <FileText className="w-6 h-6 text-gray-400" />
              Campaigns for {timeContext === 'TODAY' ? 'Today' : 'Tomorrow'}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-bold text-gray-500 uppercase">
                <Clock className="w-3.5 h-3.5" />
                {generationInfo}
              </div>
              <button 
                onClick={() => setIsNewCampaignModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                + New Campaign
              </button>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 flex-wrap pb-2">
          <span className="text-xs font-bold text-gray-400 mr-2">View:</span>
          {(['AI-Driven', 'BFL Focus', 'Top 5 Focus', 'No Offer', 'Reactivation'] as CampaignViewType[]).map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-xs font-bold transition-all border",
                activeView === view 
                  ? "bg-brand-orange text-white border-brand-orange" 
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              )}
            >
              {view === 'AI-Driven' && <Sparkles className="w-3.5 h-3.5 inline mr-2" />}
              {view}
              {view === 'AI-Driven' && <ChevronDown className="w-3.5 h-3.5 inline ml-2" />}
            </button>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-[32px] overflow-hidden shadow-sm">
          {/* View Summary Header */}
          <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  {activeView} View
                  <span className="text-xs font-normal text-gray-500">
                    ({activeView === 'AI-Driven' ? 'Full 1:1 optimization' : 'Constrained focus'} - {filteredCampaigns.length} campaigns)
                  </span>
                </h3>
                {activeView === 'Top 5 Focus' && (
                  <p className="text-[10px] text-gray-400 font-medium tracking-tight">
                    Partners: {top5Partners.join(', ')}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200">
                {['All Channels', 'WhatsApp', 'SMS', 'RCS'].map((ch) => (
                  <button
                    key={ch}
                    onClick={() => onChannelChange(ch as any)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                      activeChannel === ch 
                        ? "bg-orange-50 text-brand-orange" 
                        : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="px-8 py-4 w-12">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-brand-orange focus:ring-orange-300 cursor-pointer"
                    onChange={handleSelectAllCampaigns}
                    checked={selectedCampaignIds.size === filteredCampaigns.length && filteredCampaigns.length > 0}
                  />
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Campaign Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Channel</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Users</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Est. Spend</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right px-10">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCampaigns.map((c) => (
                <tr key={c.id} className={cn(
                  "hover:bg-gray-50/50 transition-colors group",
                  selectedCampaignIds.has(c.id) && "bg-orange-50/30"
                )}>
                  <td className="px-8 py-5">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-brand-orange focus:ring-orange-300 cursor-pointer"
                      checked={selectedCampaignIds.has(c.id)}
                      onChange={() => handleToggleCampaign(c.id)}
                    />
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-800">{c.name}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] tabular-nums text-gray-400 uppercase">Partner: {c.partner}</span>
                        {c.isReactivation && (
                          <span className="text-[9px] font-bold text-brand-orange bg-orange-50 px-1.5 py-0.5 rounded uppercase">Dormant</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border",
                      c.channel === 'WhatsApp' ? "bg-green-50 text-green-700 border-green-100" :
                      c.channel === 'SMS' ? "bg-orange-50 text-orange-700 border-orange-100" : "bg-purple-50 text-purple-700 border-purple-100"
                    )}>
                      {c.channel}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-xs tabular-nums text-gray-600 text-right font-bold">{c.users.toLocaleString()}</td>
                  <td className="px-6 py-5 text-xs tabular-nums text-gray-900 text-right font-bold">{c.spend}</td>
                  <td className="px-6 py-5 text-right px-10">
                    <button className="text-[10px] font-bold text-brand-orange hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors border border-orange-100 shadow-sm bg-white uppercase">
                      [Details]
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCampaigns.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center space-y-3">
                    <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 text-gray-400">
                      <Info className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">No campaigns found in this view</p>
                      <p className="text-xs text-gray-500">The RL engine did not generate any actions matching these constraints for {timeContext.toLowerCase()}.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Selection Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600">
                Selected: <span className="text-brand-orange">{selectedCampaignIds.size}</span> of {filteredCampaigns.length} campaigns | Total est. spend: <span className="text-gray-900 ml-2">₹{totalEstSpend}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
                <Download className="w-4 h-4" /> [Export]
              </button>
              <button 
                disabled={selectedCampaignIds.size === 0}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all",
                  selectedCampaignIds.size > 0 ? "bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100" : "bg-gray-100 text-gray-400 opacity-50"
                )}
              >
                [Launch Selected]
              </button>
              <button className="flex items-center gap-2 px-8 py-3 bg-brand-orange text-white rounded-2xl text-sm font-extrabold hover:bg-orange-600 transition-all">
                <Rocket className="w-4 h-4" /> [Launch All]
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NEW CAMPAIGN MODAL */}
      <AnimatePresence>
        {isNewCampaignModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewCampaignModalOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-gray-900 leading-none">
                    {modalStep === 'selection' && "Create New Campaign"}
                    {modalStep === 'quick' && "Create Manual Campaign"}
                    {modalStep === 'template' && "Select Template"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {modalStep === 'selection' && "Choose a method to inform the decision engine"}
                    {modalStep === 'quick' && "Override RL engine with a custom strategy"}
                    {modalStep === 'template' && "Copy parameters from a successful past run"}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setIsNewCampaignModalOpen(false);
                    setModalStep('selection');
                  }}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-8">
                {modalStep === 'selection' && (
                  <div className="space-y-4">
                    <button 
                      onClick={() => {
                        setIsNewCampaignModalOpen(false);
                        onSetupUseCase?.();
                      }}
                      className="w-full group text-left p-5 bg-white border border-gray-200 rounded-2xl hover:border-brand-orange hover:shadow-md transition-all flex items-center gap-4"
                    >
                      <div className="p-3 bg-orange-50 rounded-xl group-hover:bg-brand-orange transition-colors">
                        <Target className="w-6 h-6 text-brand-orange group-hover:text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Set a Goal (Use Case)</h4>
                        <p className="text-xs text-gray-500 mt-1">Long-term optimization and objective tracking</p>
                      </div>
                      <ChevronRight className="w-5 h-5 ml-auto text-gray-300 group-hover:text-brand-orange" />
                    </button>

                    <button 
                      onClick={() => setModalStep('quick')}
                      className="w-full group text-left p-5 bg-white border border-gray-200 rounded-2xl hover:border-brand-orange hover:shadow-md transition-all flex items-center gap-4"
                    >
                      <div className="p-3 bg-orange-50 rounded-xl group-hover:bg-orange-600 transition-colors">
                        <Zap className="w-6 h-6 text-orange-600 group-hover:text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Quick Campaign</h4>
                        <p className="text-xs text-gray-500 mt-1">Directly tell engine what to do for a short burst</p>
                      </div>
                      <ChevronRight className="w-5 h-5 ml-auto text-gray-300 group-hover:text-orange-600" />
                    </button>

                    <button 
                      onClick={() => setModalStep('template')}
                      className="w-full group text-left p-5 bg-white border border-gray-200 rounded-2xl hover:border-brand-orange hover:shadow-md transition-all flex items-center gap-4"
                    >
                      <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-600 transition-colors">
                        <FileText className="w-6 h-6 text-purple-600 group-hover:text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">From Template</h4>
                        <p className="text-xs text-gray-500 mt-1">Use a saved campaign structure and parameters</p>
                      </div>
                      <ChevronRight className="w-5 h-5 ml-auto text-gray-300 group-hover:text-purple-600" />
                    </button>
                  </div>
                )}

                {modalStep === 'quick' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">1. Audience Selection</label>
                        <div className="flex gap-4">
                          <select 
                            value={manualFormData.segment}
                            onChange={(e) => setManualFormData({...manualFormData, segment: e.target.value})}
                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-orange-300 transition-all font-medium"
                          >
                            <option value="">Select Segment...</option>
                            <option value="S1">High intent PL users</option>
                            <option value="S2">Dormant high value</option>
                            <option value="S3">Price sensitive</option>
                          </select>
                          <button className="px-6 py-3 bg-gray-100 text-slate-800 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors">
                            Upload CSV
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">2. Conversion Event</label>
                          <select 
                            value={manualFormData.conversion}
                            onChange={(e) => setManualFormData({...manualFormData, conversion: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-orange-300 transition-all font-medium"
                          >
                            <option>Disbursal</option>
                            <option>AIP Submitted</option>
                            <option>Click-through</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">3. Creative/Template</label>
                          <select 
                            value={manualFormData.template}
                            onChange={(e) => setManualFormData({...manualFormData, template: e.target.value})}
                            className="w-full px-4 py-3 bg-white border-2 border-brand-orange rounded-xl text-sm outline-none shadow-[0_0_0_1px_rgba(37,99,235,0.1)] font-medium"
                          >
                            <option value="">Select Template...</option>
                            <option value="T1">PL_Welcome_v1</option>
                            <option value="T2">PL_Reminder_v2</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">4. Send Time Window</label>
                          <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <input 
                                type="time" 
                                className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none font-medium" 
                              />
                            </div>
                            <span className="text-gray-300 text-xs font-bold italic">to</span>
                            <div className="relative flex-1">
                              <input 
                                type="time" 
                                className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none font-medium" 
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Budget (₹)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                            <input 
                              type="text" 
                              value={manualFormData.budget}
                              onChange={(e) => setManualFormData({...manualFormData, budget: e.target.value})}
                              className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none tabular-nums font-medium" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-orange-50 border border-orange-100 rounded-2xl flex items-start gap-4">
                      <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
                      <p className="text-[11px] font-medium text-orange-800 leading-relaxed">
                        Manual campaigns will override RL engine decisions for the selected audience. Frequency caps will still be enforced to prevent spam.
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <button 
                        onClick={() => setModalStep('selection')}
                        className="px-8 py-3 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => setIsNewCampaignModalOpen(false)}
                        className="px-12 py-3 bg-brand-orange text-white rounded-2xl font-extrabold hover:bg-orange-600 transition-all active:scale-95"
                      >
                        Create Campaign
                      </button>
                    </div>
                  </div>
                )}

                {modalStep === 'template' && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      {TOMORROW_CAMPAIGNS.slice(0, 4).map(c => (
                        <button 
                          key={c.id} 
                          onClick={() => {
                            onSelectionChange?.({ partners: [c.partner], campaigns: [c] });
                            onOpenCopilot?.(`I want to create a new campaign based on the template: "${c.name}". It is for ${c.partner} on the ${c.channel} channel. Let's optimize the creative and scheduling.`);
                            setIsNewCampaignModalOpen(false);
                            setModalStep('selection');
                          }}
                          className="w-full text-left p-4 bg-gray-50 border border-gray-100 rounded-xl hover:border-orange-300 transition-all flex items-center justify-between group"
                        >
                          <div>
                            <p className="text-sm font-bold text-gray-800">{c.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">{c.partner} · {c.channel}</p>
                          </div>
                          <span className="text-[10px] font-bold text-brand-orange group-hover:underline tracking-tight">[Use Template]</span>
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-start">
                      <button 
                        onClick={() => setModalStep('selection')}
                        className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors py-2"
                      >
                        ← Back to methods
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {modalStep === 'selection' && (
                <div className="p-6 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <AlertCircle className="w-4 h-4" />
                    Overnight RL run still applies
                  </div>
                  <button 
                    onClick={() => setIsNewCampaignModalOpen(false)}
                    className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
