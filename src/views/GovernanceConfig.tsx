import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Smartphone, 
  MessageSquare, 
  Mail, 
  Zap, 
  AlertCircle,
  Save,
  RotateCcw,
  Info,
  ChevronLeft,
  Lock,
  Smartphone as PhoneIcon,
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- Types ---

interface GlobalCap {
  id: string;
  enabled: boolean;
  window: 'Daily' | 'Weekly' | 'Monthly';
  cap: number;
  utilization: string;
}

interface ChannelGuideline {
  id: string;
  enabled: boolean;
  channel: string;
  daily: number;
  weekly: number;
  monthly: number;
  purpose: string;
}

interface BudgetLimit {
  id: string;
  enabled: boolean;
  channel: string;
  daily: number;
  weekly: number;
  monthly: number;
  spend: number;
  isFree?: boolean;
}

// --- Mock Data ---

const initialGlobalCaps: GlobalCap[] = [
  { id: '1', enabled: true, window: 'Daily', cap: 5, utilization: '0.02% users at cap' },
  { id: '2', enabled: true, window: 'Weekly', cap: 25, utilization: '0.01% users at cap' },
  { id: '3', enabled: true, window: 'Monthly', cap: 50, utilization: '0.005% users at cap' },
];

const initialChannelGuidelines: ChannelGuideline[] = [
  { id: 'c1', enabled: true, channel: 'WhatsApp', daily: 3, weekly: 10, monthly: 15, purpose: 'High fatigue' },
  { id: 'c2', enabled: true, channel: 'SMS', daily: 3, weekly: 20, monthly: 30, purpose: 'Reliable' },
  { id: 'c3', enabled: true, channel: 'RCS', daily: 2, weekly: 10, monthly: 20, purpose: 'Rich media' },
];

const initialBudgetLimits: BudgetLimit[] = [
  { id: 'b1', enabled: true, channel: 'WhatsApp', daily: 2500000, weekly: 15000000, monthly: 60000000, spend: 1240000 },
  { id: 'b2', enabled: true, channel: 'SMS', daily: 1500000, weekly: 9000000, monthly: 36000000, spend: 820000 },
  { id: 'b3', enabled: true, channel: 'RCS', daily: 500000, weekly: 3000000, monthly: 12000000, spend: 120000 },
];

export default function GovernanceConfig({ onBack }: { onBack?: () => void }) {
  const [globalCaps, setGlobalCaps] = useState(initialGlobalCaps);
  const [channelGuidelines, setChannelGuidelines] = useState(initialChannelGuidelines);
  const [budgetLimits, setBudgetLimits] = useState(initialBudgetLimits);
  const [traiEnabled, setTraiEnabled] = useState(true);
  const [minGap, setMinGap] = useState(2);
  const [dndEnabled, setDndEnabled] = useState(true);
  const [optOutEnabled, setOptOutEnabled] = useState(true);
  const [blacklistEnabled, setBlacklistEnabled] = useState(true);

  const toggleGlobalCap = (id: string) => {
    setGlobalCaps(prev => prev.map(cap => cap.id === id ? { ...cap, enabled: !cap.enabled } : cap));
  };

  const updateGlobalCap = (id: string, value: number) => {
    setGlobalCaps(prev => prev.map(cap => cap.id === id ? { ...cap, cap: value } : cap));
  };

  const toggleChannelGuideline = (id: string) => {
    setChannelGuidelines(prev => prev.map(g => g.id === id ? { ...g, enabled: !g.enabled } : g));
  };

  const updateChannelGuideline = (id: string, field: 'daily' | 'weekly' | 'monthly', value: number) => {
    setChannelGuidelines(prev => prev.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  const toggleBudgetLimit = (id: string) => {
    setBudgetLimits(prev => prev.map(b => b.id === id ? { ...b, enabled: !b.enabled } : b));
  };

  const updateBudgetLimit = (id: string, field: 'daily' | 'weekly' | 'monthly', value: number) => {
    setBudgetLimits(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${val.toLocaleString()}`;
  };

  const getBudgetStatus = (b: BudgetLimit) => {
    if (b.isFree) return { color: 'text-gray-400', label: 'Free', bg: 'bg-gray-50' };
    const pct = (b.spend / b.daily) * 100;
    if (pct > 90) return { color: 'text-red-600', label: `${pct.toFixed(0)}%`, bg: 'bg-red-50' };
    if (pct > 70) return { color: 'text-amber-600', label: `${pct.toFixed(0)}%`, bg: 'bg-amber-50' };
    return { color: 'text-green-600', label: `${pct.toFixed(0)}%`, bg: 'bg-green-50' };
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ChevronLeft className="w-6 h-6 text-gray-500" />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Governance Configuration</h1>
            <p className="text-gray-500 mt-1 text-sm font-medium">Configure global frequency caps, channel guidelines, and compliance rules.</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-xl transition-all">
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </button>
          <button className="flex items-center gap-2 px-10 py-3.5 bg-brand-orange text-white rounded-2xl font-extrabold hover:bg-orange-600 transition-all">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Global Caps (Hard Limits) */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 pb-2">
          <div className="p-2 bg-red-50 border border-red-100 rounded-xl">
            <Lock className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Global Caps (Hard Limits)</h3>
            <p className="text-sm text-gray-500 font-medium">System-enforced maximums across all channels.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <table className="w-full text-left">
            <thead className="bg-[#fcfdfe] border-b border-gray-50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-24">Enable</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Window</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cap per User</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Utilization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {globalCaps.map((cap) => (
                <tr key={cap.id} className={cn("transition-all", !cap.enabled && "opacity-50")}>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => toggleGlobalCap(cap.id)}
                      className={cn(
                        "w-12 h-6 rounded-full transition-all relative",
                        cap.enabled ? "bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.2)]" : "bg-gray-200"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                        cap.enabled ? "right-1" : "left-1"
                      )} />
                    </button>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-gray-900 tracking-tight">{cap.window}</td>
                  <td className="px-8 py-6">
                    <input 
                      type="number" 
                      value={cap.cap}
                      onChange={(e) => updateGlobalCap(cap.id, parseInt(e.target.value) || 0)}
                      className="w-24 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-red-100 outline-none text-center"
                    />
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                      <span className="text-xs font-bold text-gray-600">{cap.utilization}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Per-Channel Guidelines (Soft Limits) */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 pb-2">
          <div className="p-2 bg-orange-50 border border-orange-100 rounded-xl">
            <Zap className="w-5 h-5 text-brand-orange" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Per-Channel Guidelines (Soft Limits)</h3>
            <p className="text-sm text-gray-500 font-medium">Recommended maximums used by the RL engine as optimization constraints.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <table className="w-full text-left">
            <thead className="bg-[#fcfdfe] border-b border-gray-50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-24">Enable</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Channel</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Daily</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Weekly</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Monthly</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {channelGuidelines.map((g) => (
                <tr key={g.id} className={cn("transition-all", !g.enabled && "opacity-50")}>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => toggleChannelGuideline(g.id)}
                      className={cn(
                        "w-12 h-6 rounded-full transition-all relative",
                        g.enabled ? "bg-brand-orange shadow-[0_0_10px_rgba(249,115,22,0.2)]" : "bg-gray-200"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                        g.enabled ? "right-1" : "left-1"
                      )} />
                    </button>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-900 tracking-tight">
                      <ChannelIcon channel={g.channel} />
                      {g.channel}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <input 
                      type="number" 
                      value={g.daily} 
                      onChange={(e) => updateChannelGuideline(g.id, 'daily', parseInt(e.target.value) || 0)} 
                      className="w-16 px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-center outline-none focus:ring-2 focus:ring-orange-100" 
                    />
                  </td>
                  <td className="px-8 py-6">
                    <input 
                      type="number" 
                      value={g.weekly} 
                      onChange={(e) => updateChannelGuideline(g.id, 'weekly', parseInt(e.target.value) || 0)} 
                      className="w-16 px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-center outline-none focus:ring-2 focus:ring-orange-100" 
                    />
                  </td>
                  <td className="px-8 py-6">
                    <input 
                      type="number" 
                      value={g.monthly} 
                      onChange={(e) => updateChannelGuideline(g.id, 'monthly', parseInt(e.target.value) || 0)} 
                      className="w-16 px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-center outline-none focus:ring-2 focus:ring-orange-100" 
                    />
                  </td>
                  <td className="px-8 py-6 text-xs text-gray-400 italic font-medium">{g.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-8 py-4 bg-[#f0f7ff] border-t border-gray-50 flex items-center gap-3">
            <Info className="w-4 h-4 text-brand-orange" />
            <p className="text-[10px] font-black text-orange-700 uppercase tracking-widest">Note: RL uses these as guidelines. Global cap is the only hard limit.</p>
          </div>
        </div>
      </section>

      {/* Budget Governance */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 pb-2">
          <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-xl">
            <Zap className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Budget Governance</h3>
            <p className="text-sm text-gray-500 font-medium">Set budget limits at channel and overall level. Alerts trigger when thresholds are reached.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <table className="w-full text-left">
            <thead className="bg-[#fcfdfe] border-b border-gray-50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-24">Enable</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Channel</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Daily Cap</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Weekly Cap</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Monthly Cap</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Current Spend</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {budgetLimits.map((b) => {
                const status = getBudgetStatus(b);
                return (
                  <tr key={b.id} className={cn("transition-all", !b.enabled && "opacity-50")}>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => toggleBudgetLimit(b.id)}
                        className={cn(
                          "w-12 h-6 rounded-full transition-all relative",
                          b.enabled ? "bg-emerald-600 shadow-[0_0_10px_rgba(5,150,105,0.2)]" : "bg-gray-200"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                          b.enabled ? "right-1" : "left-1"
                        )} />
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-900 tracking-tight">
                        <ChannelIcon channel={b.channel} />
                        {b.channel}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <input 
                        type="number" 
                        value={b.daily} 
                        onChange={(e) => updateBudgetLimit(b.id, 'daily', parseInt(e.target.value) || 0)} 
                        className="w-24 px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-center outline-none focus:ring-2 focus:ring-emerald-100" 
                      />
                    </td>
                    <td className="px-8 py-6 text-center">
                      <input 
                        type="number" 
                        value={b.weekly} 
                        onChange={(e) => updateBudgetLimit(b.id, 'weekly', parseInt(e.target.value) || 0)} 
                        className="w-24 px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-center outline-none focus:ring-2 focus:ring-emerald-100" 
                      />
                    </td>
                    <td className="px-8 py-6 text-center">
                      <input 
                        type="number" 
                        value={b.monthly} 
                        onChange={(e) => updateBudgetLimit(b.id, 'monthly', parseInt(e.target.value) || 0)} 
                        className="w-24 px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-center outline-none focus:ring-2 focus:ring-emerald-100" 
                      />
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(b.spend)}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider", status.bg, status.color)}>
                        <div className={cn("w-1.5 h-1.5 rounded-full px-0", status.color.replace('text', 'bg'))} />
                        {status.label}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Overall Budget Limit (Combined)</p>
                <p className="text-[10px] font-bold text-gray-400">Total monthly burn threshold across all active channels.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right">
                  <p className="text-xl font-black text-gray-900">₹10.8Cr</p>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest text-right">Limit: ₹15.0Cr</p>
               </div>
               <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all">Configure Limit</button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Time-Based Rules */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 pb-2">
            <div className="p-2 bg-purple-50 border border-purple-100 rounded-xl">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Time-Based Rules</h3>
          </div>
          <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-gray-900 tracking-tight">TRAI Blockout Hours</p>
                <p className="text-xs font-medium text-gray-400 leading-relaxed">Restrict all communications between 9 PM - 9 AM.</p>
              </div>
              <button 
                onClick={() => setTraiEnabled(!traiEnabled)}
                className={cn(
                  "w-14 h-7 rounded-full transition-all relative",
                  traiEnabled ? "bg-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.2)]" : "bg-gray-200"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-5 h-5 bg-white rounded-full transition-all",
                  traiEnabled ? "right-1" : "left-1"
                )} />
              </button>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-gray-900 tracking-tight">Minimum Gap Between Messages</p>
                <p className="text-xs font-medium text-gray-400 leading-relaxed">Prevent rapid-fire messaging to the same user.</p>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  value={minGap} 
                  onChange={() => {}}
                  className="w-20 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-center outline-none focus:ring-2 focus:ring-purple-100"
                />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hours</span>
              </div>
            </div>
          </div>
        </section>

        {/* DND & Consent */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 pb-2">
            <div className="p-2 bg-green-50 border border-green-100 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">DND & Consent</h3>
          </div>
          <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-8">
            {[
              { label: 'Respect DND Registry', desc: 'Auto-exclude users registered in national DND.', state: dndEnabled, setState: setDndEnabled },
              { label: 'Respect User Opt-outs', desc: 'Honor channel-specific unsubscribe requests.', state: optOutEnabled, setState: setOptOutEnabled },
              { label: 'Apply Blacklist', desc: 'Exclude users in the global suppression list.', state: blacklistEnabled, setState: setBlacklistEnabled },
            ].map((rule, idx) => (
              <div key={rule.label} className={cn("flex items-center justify-between", idx > 0 && "pt-6 border-t border-gray-50")}>
                <div className="space-y-1.5">
                  <p className="text-sm font-bold text-gray-900 tracking-tight">{rule.label}</p>
                  <p className="text-xs font-medium text-gray-400 leading-relaxed">{rule.desc}</p>
                </div>
                <button 
                  onClick={() => rule.setState(!rule.state)}
                  className={cn(
                    "w-14 h-7 rounded-full transition-all relative",
                    rule.state ? "bg-green-600 shadow-[0_0_10px_rgba(22,163,74,0.2)]" : "bg-gray-200"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-5 h-5 bg-white rounded-full transition-all",
                    rule.state ? "right-1" : "left-1"
                  )} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ChannelIcon({ channel }: { channel: string }) {
  switch (channel) {
    case 'WhatsApp': return <PhoneIcon className="w-4 h-4 text-green-600" />;
    case 'SMS': return <MessageSquare className="w-4 h-4 text-brand-orange" />;
    case 'RCS': return <PhoneIcon className="w-4 h-4 text-purple-600" />;
    case 'Email': return <Mail className="w-4 h-4 text-red-600" />;
    default: return <Smartphone className="w-4 h-4 text-gray-400" />;
  }
}
