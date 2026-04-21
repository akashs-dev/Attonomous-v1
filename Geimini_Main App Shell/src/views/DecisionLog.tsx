import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Search, 
  Smartphone, 
  MessageSquare, 
  Mail, 
  Info, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  AlertCircle,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  TrendingUp,
  Target,
  User,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

// --- Types ---
type DecisionType = 'Communicate' | 'Do Nothing';
type ChannelType = 'WhatsApp' | 'SMS' | 'RCS' | 'Email';
type StatusType = 'Executed' | 'Today' | 'Planned';

interface Decision {
  id: string;
  userId: string;
  userName: string;
  type: DecisionType;
  channel: ChannelType;
  partner: string;
  time: string;
  date: string;
  status: StatusType;
  predictedCTR: number;
  predictedAIP: number;
  factors: { label: string; impact: 'high' | 'medium' | 'low'; value: string }[];
  alternatives: { type: string; channel: string; reason: string }[];
  campaignName: string;
  campaignId: string;
}

// --- Mock Data ---
const mockDecisions: Decision[] = [
  {
    id: 'D1',
    userId: 'USR_8821',
    userName: 'Aditya Sharma',
    type: 'Communicate',
    channel: 'WhatsApp',
    partner: 'Gupshup',
    time: '10:30 AM',
    date: 'Apr 12',
    status: 'Executed',
    predictedCTR: 8.4,
    predictedAIP: 1.2,
    campaignName: 'PL_Growth_Q2_Nudge',
    campaignId: 'C1',
    factors: [
      { label: 'Recent App Activity', impact: 'high', value: '3 sessions in 24h' },
      { label: 'Credit Score', impact: 'high', value: '780+' },
      { label: 'Time of Day', impact: 'medium', value: 'Peak engagement window' }
    ],
    alternatives: [
      { type: 'Do Nothing', channel: '-', reason: 'High intent detected, opportunity cost too high' },
      { type: 'Communicate', channel: 'SMS', reason: 'Lower predicted CTR (3.2%) compared to WhatsApp' }
    ]
  },
  {
    id: 'D2',
    userId: 'USR_9902',
    userName: 'Priya Patel',
    type: 'Do Nothing',
    channel: 'SMS',
    partner: '-',
    time: '11:15 AM',
    date: 'Apr 15',
    status: 'Executed',
    predictedCTR: 0.5,
    predictedAIP: 0.1,
    campaignName: 'PL_Growth_Q2_Nudge',
    campaignId: 'C1',
    factors: [
      { label: 'Frequency Cap', impact: 'high', value: 'Reached max weekly limit' },
      { label: 'Last Interaction', impact: 'medium', value: 'Negative sentiment in last chat' },
      { label: 'Balance Status', impact: 'low', value: 'Sufficient funds detected' }
    ],
    alternatives: [
      { type: 'Communicate', channel: 'WhatsApp', reason: 'Risk of churn due to over-communication' }
    ]
  },
  {
    id: 'D3',
    userId: 'USR_4410',
    userName: 'Rahul Verma',
    type: 'Communicate',
    channel: 'RCS',
    partner: 'Google',
    time: '02:00 PM',
    date: 'Apr 15',
    status: 'Today',
    predictedCTR: 12.1,
    predictedAIP: 2.5,
    campaignName: 'PL_Growth_Q2_Nudge',
    campaignId: 'C1',
    factors: [
      { label: 'Device Capability', impact: 'high', value: 'RCS Enabled (Android)' },
      { label: 'Product Affinity', impact: 'high', value: 'High Personal Loan interest' },
      { label: 'Past Channel Pref', impact: 'medium', value: '80% response rate on Rich Media' }
    ],
    alternatives: [
      { type: 'Communicate', channel: 'SMS', reason: 'RCS offers 3x better engagement for this segment' },
      { type: 'Do Nothing', channel: '-', reason: 'High probability of conversion (2.5%)' }
    ]
  },
  {
    id: 'D4',
    userId: 'USR_1234',
    userName: 'Sanjay Gupta',
    type: 'Communicate',
    channel: 'Email',
    partner: 'SendGrid',
    time: '09:00 AM',
    date: 'Apr 14',
    status: 'Executed',
    predictedCTR: 4.2,
    predictedAIP: 0.8,
    campaignName: 'PL_Growth_Q2_Nudge',
    campaignId: 'C1',
    factors: [
      { label: 'Email Consistency', impact: 'high', value: 'Primary contact method' }
    ],
    alternatives: []
  },
  {
    id: 'D5',
    userId: 'USR_5678',
    userName: 'Meera Das',
    type: 'Communicate',
    channel: 'WhatsApp',
    partner: 'Gupshup',
    time: '04:30 PM',
    date: 'Apr 16',
    status: 'Planned',
    predictedCTR: 9.8,
    predictedAIP: 1.5,
    campaignName: 'PL_Growth_Q2_Nudge',
    campaignId: 'C1',
    factors: [
      { label: 'Evening Peak', impact: 'medium', value: 'High activity after 4pm' }
    ],
    alternatives: []
  }
];

const calendarDays = [
  { date: 'Apr 12', status: 'Executed', icon: '✅' },
  { date: 'Apr 13', status: 'Executed', icon: '✅' },
  { date: 'Apr 14', status: 'Executed', icon: '✅' },
  { date: 'Apr 15', status: 'Today', icon: '🟡' },
  { date: 'Apr 16', status: 'Planned', icon: '🔮' },
  { date: 'Apr 17', status: 'Planned', icon: '🔮' },
  { date: 'Apr 18', status: 'Planned', icon: '🔮' },
];

export default function DecisionLog({ 
  hideHeader = false, 
  useCaseId 
}: { 
  hideHeader?: boolean; 
  useCaseId?: string;
}) {
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState('Apr 15');
  const [filterType, setFilterType] = useState('All');
  const [filterChannel, setFilterChannel] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredDecisions = mockDecisions.filter(decision => {
    const matchesCalendarDate = decision.date === selectedCalendarDate;
    const matchesSearch = decision.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          decision.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || decision.type === filterType;
    const matchesChannel = filterChannel === 'All' || decision.channel === filterChannel;
    
    return matchesCalendarDate && matchesSearch && matchesType && matchesChannel;
  });

  return (
    <div className={cn("max-w-7xl mx-auto space-y-8", !hideHeader && "p-8")}>
      {/* Header */}
      {!hideHeader && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Decision Log</h1>
            <p className="text-gray-500 mt-1">1:1 user-level decisions from the RL engine</p>
          </div>
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
            {['Yesterday', 'Today', 'Tomorrow', 'Select Date'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedDate(tab)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                  selectedDate === tab 
                    ? "bg-brand-orange text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-50"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Calendar Strip */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Decision Schedule</h3>
          <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
            <span className="flex items-center gap-1"><span className="text-green-500">✅</span> Executed</span>
            <span className="flex items-center gap-1"><span className="text-yellow-500">🟡</span> Today</span>
            <span className="flex items-center gap-1"><span className="text-purple-500">🔮</span> Planned</span>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day) => (
            <div 
              key={day.date}
              onClick={() => setSelectedCalendarDate(day.date)}
              className={cn(
                "flex flex-col items-center p-3 rounded-xl border transition-all cursor-pointer",
                selectedCalendarDate === day.date
                  ? "bg-black border-black text-white shadow-lg scale-105 z-10" 
                  : day.status === 'Today'
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-gray-50 border-gray-100 hover:border-gray-200"
              )}
            >
              <span className={cn(
                "text-[10px] font-bold uppercase mb-1",
                selectedCalendarDate === day.date ? "text-gray-400" : "text-gray-400"
              )}>{day.date}</span>
              <span className="text-xl">{day.icon}</span>
              {day.status === 'Today' && selectedCalendarDate !== day.date && (
                <span className="text-[8px] font-black text-yellow-600 mt-1 uppercase tracking-tighter">Today</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by User ID or Name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-black/5"
          >
            <option value="All">All Decisions</option>
            <option value="Communicate">Communicate</option>
            <option value="Do Nothing">Do Nothing</option>
          </select>

          <select 
            value={filterChannel}
            onChange={(e) => setFilterChannel(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-black/5"
          >
            <option value="All">All Channels</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="SMS">SMS</option>
            <option value="RCS">RCS</option>
          </select>

          <button className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Decisions List */}
      <div className="space-y-4">
        {filteredDecisions.length > 0 ? (
          filteredDecisions.map((decision) => (
            <DecisionCard 
              key={decision.id} 
              decision={decision} 
              isExpanded={expandedId === decision.id}
              onToggle={() => toggleExpand(decision.id)}
            />
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center space-y-3">
            <Calendar className="w-12 h-12 text-gray-200 mx-auto" />
            <p className="text-gray-500 font-medium">No decisions recorded for {selectedCalendarDate}</p>
            <button 
              onClick={() => setSelectedCalendarDate('Apr 15')}
              className="text-xs font-black text-brand-orange hover:underline px-4 py-2"
            >
              Back to Today
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DecisionCard({ decision, isExpanded, onToggle }: { decision: Decision; isExpanded: boolean; onToggle: () => void; key?: React.Key }) {
  return (
    <motion.div 
      layout
      className={cn(
        "bg-white border rounded-2xl overflow-hidden transition-all",
        isExpanded ? "border-black shadow-xl" : "border-gray-200 hover:border-gray-300 shadow-sm"
      )}
    >
      {/* Collapsed Header */}
      <div 
        onClick={onToggle}
        className="p-5 flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{decision.userName}</h4>
              <p className="text-xs text-gray-500 tabular-nums">{decision.userId}</p>
            </div>
          </div>

          <div className="h-8 w-px bg-gray-100 hidden md:block" />

          <div className="hidden md:flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Action</span>
            <div className="flex items-center gap-2">
              <span className={cn(
                "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                decision.type === 'Communicate' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
              )}>
                {decision.type}
              </span>
              {decision.type === 'Communicate' && (
                <div className="flex items-center gap-1 text-xs font-medium text-gray-700">
                  <ChannelIcon channel={decision.channel} />
                  <span>{decision.channel}</span>
                </div>
              )}
            </div>
          </div>

          <div className="h-8 w-px bg-gray-100 hidden lg:block" />

          <div className="hidden lg:flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Partner</span>
            <span className="text-sm font-medium text-gray-700">{decision.partner}</span>
          </div>

          <div className="h-8 w-px bg-gray-100 hidden xl:block" />

          <div className="hidden xl:flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Expected CTR</span>
            <span className="text-sm font-bold text-brand-orange">{decision.predictedCTR}%</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-bold text-gray-900">{decision.time}</p>
            <p className="text-[10px] text-gray-400">{decision.status}</p>
          </div>
          <div className="p-2 rounded-lg group-hover:bg-gray-100 transition-all">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100"
          >
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Why? Factors */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <h5 className="text-sm font-bold text-gray-900">Why this decision?</h5>
                </div>
                <div className="space-y-3">
                  {decision.factors.map((factor, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-gray-700">{factor.label}</span>
                        <span className={cn(
                          "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded",
                          factor.impact === 'high' ? "bg-red-100 text-red-700" : 
                          factor.impact === 'medium' ? "bg-orange-100 text-orange-700" : 
                          "bg-orange-100 text-orange-700"
                        )}>
                          {factor.impact} Impact
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{factor.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alternatives */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-orange-600" />
                  <h5 className="text-sm font-bold text-gray-900">Alternatives Considered</h5>
                </div>
                <div className="space-y-3">
                  {decision.alternatives.map((alt, idx) => (
                    <div key={idx} className="p-3 bg-white border border-gray-100 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">{alt.type}</span>
                        {alt.channel !== '-' && <span className="text-[10px] font-bold text-gray-400 uppercase">• {alt.channel}</span>}
                      </div>
                      <p className="text-xs text-gray-600 italic">"{alt.reason}"</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outcomes & Actions */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-brand-orange" />
                    <h5 className="text-sm font-bold text-gray-900">Predicted Outcomes</h5>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-orange-50 rounded-2xl">
                      <p className="text-[10px] font-bold text-brand-orange uppercase mb-1">CTR</p>
                      <p className="text-2xl font-bold text-gray-900">{decision.predictedCTR}%</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-2xl">
                      <p className="text-[10px] font-bold text-brand-orange uppercase mb-1">AIP Prob.</p>
                      <p className="text-2xl font-bold text-gray-900">{decision.predictedAIP}%</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <p className="text-xs font-bold text-gray-400 uppercase">Campaign Context</p>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-700">{decision.campaignName}</span>
                    <button className="text-xs font-bold text-black hover:underline flex items-center gap-1">
                      View Campaign <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2.5 bg-brand-orange text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-all">
                      Override Decision
                    </button>
                    <button className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all">
                      Flag for Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ChannelIcon({ channel }: { channel: ChannelType }) {
  switch (channel) {
    case 'WhatsApp': return <Smartphone className="w-3 h-3 text-green-600" />;
    case 'SMS': return <MessageSquare className="w-3 h-3 text-brand-orange" />;
    case 'RCS': return <Smartphone className="w-3 h-3 text-purple-600" />;
    case 'Email': return <Mail className="w-3 h-3 text-red-600" />;
    default: return null;
  }
}
