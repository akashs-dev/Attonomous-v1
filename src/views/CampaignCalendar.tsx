import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Smartphone, 
  MessageSquare, 
  Mail, 
  Users, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Target,
  Filter,
  Plus,
  X,
  Info,
  Download,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Brain,
  ExternalLink,
  Pause,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

// --- Types ---
type ChannelType = 'WhatsApp' | 'SMS' | 'RCS' | 'Email';
type CampaignStatus = 'Live' | 'Planned' | 'Completed' | 'Paused';

interface Campaign {
  id: string;
  name: string;
  useCase: string;
  channel: ChannelType;
  userCount: number;
  time: string;
  date: number; // Day of month (April 2026)
  status: CampaignStatus;
  template: string;
  expectedMetrics: { ctr: number; aip: number; spend: number };
  actualMetrics?: { ctr: number; aip: number; spend: number };
  reasoning: string[];
  audienceBreakdown: string;
}

// --- Mock Data ---
const mockCampaigns: Campaign[] = [
  {
    id: 'C1',
    name: 'HDFC_PL_Urgency_6PM',
    useCase: 'PL AIP Uplift - Q2 2026',
    channel: 'WhatsApp',
    userCount: 12345,
    time: '6:00 PM',
    date: 15,
    status: 'Live',
    template: 'WA_PL_001 - PL Urgency - Evening',
    expectedMetrics: { ctr: 18.4, aip: 8.2, spend: 4200 },
    actualMetrics: { ctr: 17.2, aip: 7.8, spend: 4150 },
    reasoning: [
      'Optimal time window for this segment: 6-8 PM',
      'HDFC offer selected over BFL (expected AIP +2.4%)',
      'Urgency template outperforms Benefit for this segment (+3.1% CTR)'
    ],
    audienceBreakdown: 'High intent, 780+ Credit Score'
  },
  {
    id: 'C2',
    name: 'BFL_Flash_Sale_10AM',
    useCase: 'PL AIP Uplift - Q2 2026',
    channel: 'SMS',
    userCount: 4500,
    time: '10:30 AM',
    date: 15,
    status: 'Live',
    template: 'SMS_FLASH_02',
    expectedMetrics: { ctr: 4.2, aip: 1.5, spend: 850 },
    reasoning: [
      'Flash sale urgency drives higher morning engagement',
      'Segment shows 2x higher response to SMS than WhatsApp for small nudges'
    ],
    audienceBreakdown: 'Inactive users > 30 days'
  },
  {
    id: 'C3',
    name: 'ICICI_Benefit_7PM',
    useCase: 'PL AIP Uplift - Q2 2026',
    channel: 'RCS',
    userCount: 890,
    time: '7:00 PM',
    date: 15,
    status: 'Live',
    template: 'RCS_BENEFIT_RICH',
    expectedMetrics: { ctr: 12.1, aip: 3.2, spend: 1200 },
    reasoning: [
      'Rich media (RCS) preferred for high-value offer visualization',
      'Evening slot aligns with peak browsing time for Android power users'
    ],
    audienceBreakdown: 'Android users, Tier 1 cities'
  },
  {
    id: 'C4',
    name: 'BFL_Flash_Sale_Tomorrow',
    useCase: 'PL AIP Uplift - Q2 2026',
    channel: 'SMS',
    userCount: 4480,
    time: '10:30 AM',
    date: 16,
    status: 'Planned',
    template: 'SMS_FLASH_02',
    expectedMetrics: { ctr: 4.1, aip: 1.4, spend: 840 },
    reasoning: [
      'Continuation of flash sale sequence',
      'Optimal frequency capping maintained'
    ],
    audienceBreakdown: 'Inactive users > 30 days'
  },
  {
    id: 'C5',
    name: 'HDFC_Urgency_Tomorrow',
    useCase: 'PL AIP Uplift - Q2 2026',
    channel: 'WhatsApp',
    userCount: 12400,
    time: '6:00 PM',
    date: 16,
    status: 'Planned',
    template: 'WA_PL_001',
    expectedMetrics: { ctr: 18.2, aip: 8.1, spend: 4180 },
    reasoning: [
      'High conversion probability detected for remaining segment',
      'Evening window remains optimal'
    ],
    audienceBreakdown: 'High intent, 780+ Credit Score'
  },
  {
    id: 'C6',
    name: 'BFL_Flash_Sale_Yesterday',
    useCase: 'PL AIP Uplift - Q2 2026',
    channel: 'SMS',
    userCount: 4520,
    time: '10:30 AM',
    date: 14,
    status: 'Completed',
    template: 'SMS_FLASH_02',
    expectedMetrics: { ctr: 4.3, aip: 1.6, spend: 860 },
    actualMetrics: { ctr: 4.5, aip: 1.7, spend: 855 },
    reasoning: [
      'Initial flash sale nudge',
      'Morning engagement peak'
    ],
    audienceBreakdown: 'Inactive users > 30 days'
  },
  {
    id: 'C7',
    name: 'HDFC_Urgency_Yesterday',
    useCase: 'PL AIP Uplift - Q2 2026',
    channel: 'WhatsApp',
    userCount: 12500,
    time: '6:00 PM',
    date: 14,
    status: 'Completed',
    template: 'WA_PL_001',
    expectedMetrics: { ctr: 18.5, aip: 8.3, spend: 4250 },
    actualMetrics: { ctr: 18.8, aip: 8.5, spend: 4240 },
    reasoning: [
      'High intent segment activation',
      'Optimal evening window'
    ],
    audienceBreakdown: 'High intent, 780+ Credit Score'
  }
];

export default function CampaignCalendar({ onSelectCampaign, hideHeader = false }: { onSelectCampaign?: (campaignId: string) => void, hideHeader?: boolean }) {
  const [view, setView] = useState<'monthly' | 'daily'>('monthly');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [currentMonth] = useState('April 2026');

  const today = 15;
  const tomorrow = 16;
  const yesterday = 14;

  return (
    <div className={cn("max-w-7xl mx-auto space-y-8 h-full flex flex-col", !hideHeader && "p-8")}>
      {/* Header & View Toggle */}
      <div className="flex items-center justify-between shrink-0">
        {!hideHeader ? (
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Campaign Calendar</h1>
            <p className="text-gray-500 mt-1">Schedule and manage multi-channel campaigns</p>
          </div>
        ) : <div />}
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => setView('monthly')}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-lg transition-all",
                view === 'monthly' ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              Monthly
            </button>
            <button 
              onClick={() => setView('daily')}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-lg transition-all",
                view === 'daily' ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              Daily
            </button>
          </div>
          {!hideHeader && (
            <button className="flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-2xl font-bold hover:bg-orange-600 transition-all">
              <Plus className="w-5 h-5" />
              New Campaign
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {view === 'monthly' ? (
            <motion.div 
              key="monthly"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full flex flex-col gap-6"
            >
              <MonthlyView 
                currentMonth={currentMonth} 
                today={today}
                onDayClick={(day) => setSelectedDay(day)}
                onCampaignClick={(c) => setSelectedCampaign(c)}
              />
            </motion.div>
          ) : (
            <motion.div 
              key="daily"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full overflow-y-auto custom-scrollbar pr-2"
            >
              <DailyView 
                today={today}
                tomorrow={tomorrow}
                yesterday={yesterday}
                onCampaignClick={(c) => setSelectedCampaign(c)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Side Panels & Modals */}
      <AnimatePresence>
        {selectedDay !== null && (
          <DayDetailsPanel 
            day={selectedDay} 
            onClose={() => setSelectedDay(null)} 
            onCampaignClick={(c) => {
              setSelectedCampaign(c);
              setSelectedDay(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCampaign && (
          <CampaignDetailsPanel 
            campaign={selectedCampaign} 
            onClose={() => setSelectedCampaign(null)}
            onViewDecisionLog={() => {
              if (onSelectCampaign) onSelectCampaign(selectedCampaign.id);
              setSelectedCampaign(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- View Components ---

function MonthlyView({ currentMonth, today, onDayClick, onCampaignClick }: { 
  currentMonth: string; 
  today: number; 
  onDayClick: (day: number) => void;
  onCampaignClick: (c: Campaign) => void;
}) {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const padding = Array.from({ length: 2 }, (_, i) => null); // Starts on Wednesday
  const grid = [...padding, ...days];

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-all"><ChevronLeft className="w-5 h-5" /></button>
        <span className="text-lg font-bold text-gray-900">{currentMonth}</span>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-all"><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">{d}</div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-7 auto-rows-fr overflow-y-auto custom-scrollbar">
          {grid.map((day, idx) => {
            const campaigns = day ? mockCampaigns.filter(c => c.date === day) : [];
            const hasCampaigns = campaigns.length > 0;
            
            return (
              <div 
                key={idx}
                onClick={() => day && onDayClick(day)}
                className={cn(
                  "border-r border-b border-gray-100 p-2 transition-all flex flex-col gap-1 min-h-[120px]",
                  day === null ? "bg-gray-50/30" : "hover:bg-gray-50/50 cursor-pointer",
                  day === today ? "bg-orange-50/20 ring-1 ring-inset ring-orange-100" : ""
                )}
              >
                {day && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "text-xs font-bold",
                        day === today ? "text-brand-orange" : "text-gray-400"
                      )}>
                        {day}
                      </span>
                      {hasCampaigns && <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />}
                    </div>
                    
                    <div className="flex flex-col gap-1 mt-1">
                      {campaigns.slice(0, 2).map(c => (
                        <div 
                          key={c.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onCampaignClick(c);
                          }}
                          className={cn(
                            "px-2 py-1 rounded-lg border text-[9px] font-bold flex flex-col gap-0.5 transition-all hover:scale-[1.02]",
                            c.status === 'Live' ? "bg-green-50 border-green-100 text-green-700" :
                            c.status === 'Planned' ? "bg-orange-50 border-orange-100 text-orange-700" :
                            "bg-gray-50 border-gray-200 text-gray-600"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <ChannelIcon channel={c.channel} size={10} />
                            <span className="opacity-60">{(c.userCount / 1000).toFixed(1)}k</span>
                          </div>
                          <div className="truncate">{c.name.split('_').pop()}</div>
                        </div>
                      ))}
                      {campaigns.length > 2 && (
                        <div className="text-[9px] font-bold text-gray-400 text-center py-0.5">
                          + {campaigns.length - 2} more
                        </div>
                      )}
                      {!hasCampaigns && (
                        <div className="flex-1 flex items-center justify-center">
                          <span className="text-[9px] font-medium text-gray-300 italic">— No campaigns —</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full" /> Live (Today)</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-orange-500 rounded-full" /> Planned (Tomorrow)</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-gray-400 rounded-full" /> Completed (Past)</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-gray-200 rounded-full" /> Empty</div>
      </div>
    </div>
  );
}

function DailyView({ today, tomorrow, yesterday, onCampaignClick }: { 
  today: number; 
  tomorrow: number; 
  yesterday: number;
  onCampaignClick: (c: Campaign) => void;
}) {
  const sections = [
    { title: 'YESTERDAY', date: 'April 14, 2026', status: 'Completed', campaigns: mockCampaigns.filter(c => c.date === yesterday) },
    { title: 'TODAY', date: 'April 15, 2026', status: 'Live', campaigns: mockCampaigns.filter(c => c.date === today) },
    { title: 'TOMORROW', date: 'April 16, 2026', status: 'Planned', campaigns: mockCampaigns.filter(c => c.date === tomorrow) },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Filters */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <select className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer hover:text-black">
            <option>All Use Cases</option>
            <option>PL AIP Uplift</option>
          </select>
          <div className="w-px h-4 bg-gray-200" />
          <select className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer hover:text-black">
            <option>All Channels</option>
            <option>WhatsApp</option>
            <option>SMS</option>
            <option>RCS</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-600 hover:text-black transition-all">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {sections.map((section) => (
        <div key={section.title} className="space-y-4">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-bold text-gray-900">
              {section.title} <span className="text-gray-400 font-medium mx-2">•</span> 
              <span className="text-gray-500 font-medium">{section.date}</span>
              <span className={cn(
                "ml-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                section.status === 'Live' ? "bg-green-100 text-green-700" :
                section.status === 'Planned' ? "bg-orange-100 text-orange-700" :
                "bg-gray-100 text-gray-600"
              )}>
                {section.status}
              </span>
            </h3>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Channel</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Campaign Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Audience</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {section.campaigns.map((c) => (
                  <tr 
                    key={c.id} 
                    onClick={() => onCampaignClick(c)}
                    className="hover:bg-gray-50/50 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{c.time}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <ChannelIcon channel={c.channel} />
                        {c.channel}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">{c.name}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{c.userCount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      {c.status === 'Live' && (
                        <button className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-[10px] font-bold hover:bg-green-100 transition-all">
                          View Live Status
                        </button>
                      )}
                      {c.status === 'Planned' && (
                        <button className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-[10px] font-bold hover:bg-red-100 transition-all flex items-center gap-1 ml-auto">
                          <Pause className="w-3 h-3" /> Pause
                        </button>
                      )}
                      {c.status === 'Completed' && (
                        <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-gray-400">
                          <CheckCircle2 className="w-3 h-3 text-green-500" /> Completed
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {section.campaigns.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400 italic">
                      No campaigns scheduled for this day
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Side Panels ---

function DayDetailsPanel({ day, onClose, onCampaignClick }: { 
  day: number; 
  onClose: () => void;
  onCampaignClick: (c: Campaign) => void;
}) {
  const campaigns = mockCampaigns.filter(c => c.date === day);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/5 backdrop-blur-[1px] z-[60]"
      />
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl z-[70] border-l border-gray-100 flex flex-col"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">April {day}, 2026</h3>
            <p className="text-xs text-gray-500">{campaigns.length} campaigns scheduled</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-all">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {campaigns.map((c) => (
            <div 
              key={c.id}
              onClick={() => onCampaignClick(c)}
              className="p-4 bg-white border border-gray-200 rounded-2xl hover:border-orange-400 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ChannelIcon channel={c.channel} size={16} />
                  <span className="text-xs font-bold text-gray-900">{c.time}</span>
                </div>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                  c.status === 'Live' ? "bg-green-100 text-green-700" :
                  c.status === 'Planned' ? "bg-orange-100 text-orange-700" :
                  "bg-gray-100 text-gray-600"
                )}>
                  {c.status}
                </span>
              </div>
              <h4 className="font-bold text-gray-900 mb-1 group-hover:text-brand-orange transition-colors">{c.name}</h4>
              <p className="text-xs text-gray-500 mb-4 line-clamp-1">{c.useCase}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3 h-3 text-gray-400" />
                  <span className="text-xs font-bold text-gray-700">{c.userCount.toLocaleString()}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 transition-all" />
              </div>
            </div>
          ))}
          {campaigns.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <CalendarIcon className="w-8 h-8 text-gray-200" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 italic">— No campaigns —</p>
                <p className="text-xs text-gray-300 mt-1">RL Engine has not scheduled anything for this date yet.</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

function CampaignDetailsPanel({ campaign, onClose, onViewDecisionLog }: { 
  campaign: Campaign; 
  onClose: () => void;
  onViewDecisionLog: () => void;
}) {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[80]"
      />
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-[480px] bg-white shadow-2xl z-[90] border-l border-gray-100 flex flex-col"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">Campaign Details</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-all">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{campaign.name}</h2>
            <div className="h-px w-full bg-gray-100" />
            
            <div className="grid grid-cols-2 gap-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Use Case</p>
                <p className="text-sm font-bold text-gray-700">{campaign.useCase}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Channel</p>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <ChannelIcon channel={campaign.channel} size={16} />
                  {campaign.channel}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date & Time</p>
                <p className="text-sm font-bold text-gray-700">Apr {campaign.date}, 2026 · {campaign.time}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</p>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    campaign.status === 'Live' ? "bg-green-500" :
                    campaign.status === 'Planned' ? "bg-orange-500" :
                    "bg-gray-400"
                  )} />
                  <span className="text-sm font-bold text-gray-700">{campaign.status}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Audience</p>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-400" />
                <span className="text-xl font-bold text-gray-900">{campaign.userCount.toLocaleString()}</span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Template</p>
              <div className="flex items-center gap-2">
                <FileTextIcon className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-bold text-gray-900 truncate">{campaign.template}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-900">Performance Metrics</h4>
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-orange-100 rounded-full" /> Expected</div>
                {campaign.actualMetrics && <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-green-100 rounded-full" /> Actual</div>}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'CTR', key: 'ctr', suffix: '%' },
                { label: 'AIP', key: 'aip', suffix: '%' },
                { label: 'Spend', key: 'spend', prefix: '₹' },
              ].map((metric) => (
                <div key={metric.label} className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase text-center">{metric.label}</p>
                  <div className="p-3 bg-orange-50/50 rounded-xl text-center">
                    <p className="text-sm font-bold text-orange-700">
                      {metric.prefix}{campaign.expectedMetrics[metric.key as keyof typeof campaign.expectedMetrics]}{metric.suffix}
                    </p>
                  </div>
                  {campaign.actualMetrics && (
                    <div className="p-3 bg-green-50/50 rounded-xl text-center">
                      <p className="text-sm font-bold text-green-700">
                        {metric.prefix}{campaign.actualMetrics[metric.key as keyof typeof campaign.actualMetrics]}{metric.suffix}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-600" />
              <h4 className="text-sm font-bold text-gray-900">RL Reasoning</h4>
            </div>
            <div className="space-y-3">
              {campaign.reasoning.map((r, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-purple-200 rounded-full mt-1.5 shrink-0" />
                  <p className="text-sm text-gray-600 leading-relaxed">{r}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col gap-3">
            <button 
              onClick={onViewDecisionLog}
              className="w-full py-4 bg-brand-orange text-white rounded-2xl font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
            >
              View Decision Log
              <ExternalLink className="w-4 h-4" />
            </button>
            <div className="flex gap-3">
              <button className="flex-1 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                <Pause className="w-4 h-4" /> Pause Campaign
              </button>
              <button className="px-6 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all">
                Export
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// --- Helper Components ---

function ChannelIcon({ channel, size = 14 }: { channel: ChannelType; size?: number }) {
  switch (channel) {
    case 'WhatsApp': return <Smartphone style={{ width: size, height: size }} className="text-green-600" />;
    case 'SMS': return <MessageSquare style={{ width: size, height: size }} className="text-brand-orange" />;
    case 'RCS': return <Smartphone style={{ width: size, height: size }} className="text-purple-600" />;
    case 'Email': return <Mail style={{ width: size, height: size }} className="text-red-600" />;
    default: return null;
  }
}

function FileTextIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      style={style}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
  );
}
