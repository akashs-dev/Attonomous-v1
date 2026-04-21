import React, { useState, useMemo } from 'react';
import { 
  Target, 
  Wallet, 
  Box, 
  Users, 
  ChevronRight, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  X,
  Info,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Brain,
  FileText,
  GripVertical,
  Clock,
  Smartphone,
  MessageSquare,
  Mail,
  PieChart,
  TrendingUp,
  Lock,
  ChevronDown,
  List
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { UseCaseConfig, FrequencyOption, DecisionDimension } from '../types/use-case';

const suggestionChips = [
  "High intent PL users",
  "Dormant high value",
  "Price sensitive",
  "Recently rejected",
  "Active savers"
];

const INITIAL_DIMENSIONS: DecisionDimension[] = [
  { id: '1', name: 'Frequency', description: 'How many times to communicate', sendTo: 'Days of Week, Channel, Offer, Time, Creative', enabled: true },
  { id: '2', name: 'Days of Week', description: 'Which day(s) to communicate', sendTo: 'Channel, Offer, Time, Creative', enabled: true },
  { id: '3', name: 'Channel', description: 'Communication channel', sendTo: 'Offer, Time, Creative', enabled: true },
  { id: '4', name: 'Offer', description: 'Incentive or promotion', sendTo: 'Time, Creative', enabled: true },
  { id: '5', name: 'Time', description: 'When to send the communication', sendTo: 'Creative', enabled: true },
  { id: '6', name: 'Creative', description: 'Content of the communication', sendTo: '-', enabled: true },
];

const INITIAL_FREQUENCIES: FrequencyOption[] = [
  { id: 'FR001', name: '1x per week', count: 1, period: '7 days' },
  { id: 'FR002', name: '2x per week', count: 2, period: '7 days' },
  { id: 'FR003', name: '3x per week', count: 3, period: '7 days' },
  { id: 'FR004', name: 'Daily', count: 7, period: '7 days' },
];

export default function UseCaseSetup({ 
  onCancel, 
  onComplete, 
  initialData 
}: { 
  onCancel?: () => void, 
  onComplete?: (data: UseCaseConfig) => void,
  initialData?: Partial<UseCaseConfig>
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UseCaseConfig>({
    goal: {
      name: initialData?.goal?.name || 'PL - AIP Uplift',
      product: 'Personal Loan',
      primaryKpi: 'AIP',
      targetLift: 15,
      ...initialData?.goal
    },
    audience: {
      description: '',
      count: 1245678,
      treatment: 80,
      control: 10,
      holdout: 10,
      ...initialData?.audience
    },
    dimensions: initialData?.dimensions || INITIAL_DIMENSIONS,
    actionBanks: {
      channels: ['WhatsApp', 'SMS', 'RCS'],
      partners: ['BFL', 'HDFC', 'ICICI'],
      frequencies: INITIAL_FREQUENCIES,
      times: ['Morning (8-11 AM)', 'Afternoon (12-4 PM)', 'Evening (5-9 PM)'],
      creatives: ['Urgency', 'Benefit', 'Reminder', 'Social Proof'],
      ...initialData?.actionBanks
    },
    guardrails: {
      dailyBudget: 500000,
      totalBudget: 5000000,
      dailyCap: 5,
      weeklyCap: 25,
      monthlyCap: 50,
      channelCaps: {},
      traiBlockout: true,
      minGap: 2,
      dndEnforcement: true,
      blacklistEnforcement: true,
      rejectionCoolingEnabled: true,
      rejectionCoolingDuration: 14,
      ...initialData?.guardrails
    },
    conversion: {
      event: 'AIP_submitted',
      timestampField: 'event_time',
      optimizeFor: 'Number',
      successMetricName: 'Incremental Monthly Value',
      ...initialData?.conversion
    }
  });

  const [isParsing, setIsParsing] = useState(false);

  const nextStep = () => setStep(s => Math.min(s + 1, 6));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const steps = [
    { title: 'Customer groups', icon: Users },
    { title: 'Decision Dimension', icon: Brain },
    { title: 'Action banks', icon: Box },
    { title: 'Conversion', icon: Zap },
    { title: 'Guardrails', icon: ShieldCheck },
    { title: 'Review & Launch', icon: FileText },
  ];

  return (
    <div className="max-w-[1400px] mx-auto p-12 space-y-10 pb-32">
      {/* Header with Back Button */}
      <div className="flex items-center gap-6">
        <button 
          onClick={onCancel}
          className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all text-gray-400"
        >
          <ChevronDown className="w-6 h-6 rotate-90" />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Configure - {formData.goal.name}
          </h2>
          <p className="text-slate-500 font-medium">Set audiences, groups, and prediction methods</p>
        </div>
      </div>

      {/* Tab-style Step Indicators */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden flex shadow-sm">
        {steps.map((s, idx) => {
          const stepNum = idx + 1;
          const isActive = step === stepNum;
          return (
            <button
              key={idx}
              onClick={() => setStep(stepNum)}
              className={cn(
                "flex-1 px-8 py-5 text-sm font-medium transition-all relative border-r border-gray-50 last:border-r-0",
                isActive ? "bg-orange-50 text-brand-orange" : "text-slate-500 hover:bg-gray-50"
              )}
            >
              {s.title}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-orange" />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
        >
            <div className="p-12 min-h-[600px]">
              {step === 1 && <StepAudience formData={formData} setFormData={setFormData} isParsing={isParsing} setIsParsing={setIsParsing} />}
              {step === 2 && <StepDimensionsPartA formData={formData} setFormData={setFormData} />}
              {step === 3 && <StepActionBanks formData={formData} setFormData={setFormData} />}
              {step === 4 && <StepConversion formData={formData} setFormData={setFormData} />}
              {step === 5 && <StepGuardrails formData={formData} setFormData={setFormData} />}
              {step === 6 && <StepSummary formData={formData} />}
            </div>

          <div className="px-12 py-8 flex justify-end items-center gap-4">
            <button 
              onClick={onCancel}
              className="px-10 py-3 bg-gray-50 text-slate-500 font-semibold rounded-xl hover:bg-gray-100 transition-all text-sm"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                console.log('Saving draft:', formData);
                onCancel?.();
              }}
              className="px-8 py-3 bg-white border border-gray-200 text-slate-700 font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm flex items-center gap-2 shadow-sm"
            >
              <FileText className="w-4 h-4" />
              Save as Draft
            </button>
            {step < 6 ? (
              <button 
                onClick={nextStep}
                className="px-12 py-3 bg-brand-orange text-white rounded-xl font-semibold hover:bg-orange-600 transition-all flex items-center gap-2 text-sm"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button 
                onClick={() => onComplete?.(formData)} 
                className="px-12 py-3 bg-brand-orange text-white rounded-xl font-semibold hover:bg-orange-600 flex items-center gap-2 text-sm"
              >
                Launch Use Case
                <Zap className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}



function StepAudience({ formData, setFormData, isParsing, setIsParsing }: any) {
  const handleAudienceChange = (field: string, val: any) => {
    setFormData({ ...formData, audience: { ...formData.audience, [field]: val } });
  };

  return (
    <div className="space-y-12">
      {/* Audience Selection Textbox */}
      <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Audience Selection</h4>
            <Info className="w-3.5 h-3.5 text-gray-300" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Detected Size:</span>
            <span className="text-sm font-bold text-slate-800">{formData.audience.count.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-6">
          <textarea
            value={formData.audience.description}
            onChange={(e) => handleAudienceChange('description', e.target.value)}
            placeholder="Enter search prompt or SQL query to define your audience (e.g., 'Target high intent customers with balance > 50k')"
            className="w-full min-h-[160px] p-6 bg-gray-50 border border-gray-100 rounded-2xl tabular-nums text-sm leading-relaxed focus:bg-white focus:border-orange-300 outline-none transition-all placeholder:font-sans placeholder:italic placeholder:text-slate-300"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Treatment Group (%)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={formData.audience.treatment}
                  onChange={(e) => handleAudienceChange('treatment', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-bold focus:border-orange-300 outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 tabular-nums text-xs">%</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Control Group (%)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={formData.audience.control}
                  onChange={(e) => handleAudienceChange('control', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-bold focus:border-slate-300 outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 tabular-nums text-xs">%</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Holdout Group (%)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={formData.audience.holdout}
                  onChange={(e) => handleAudienceChange('holdout', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-bold focus:border-brand-black/20 outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 tabular-nums text-xs">%</span>
              </div>
            </div>
          </div>

          <div className="pt-4 h-1.5 w-full bg-gray-50 rounded-full overflow-hidden flex">
            <div 
              className="h-full bg-brand-orange transition-all" 
              style={{ width: `${formData.audience.treatment}%` }} 
            />
            <div 
              className="h-full bg-slate-300 transition-all" 
              style={{ width: `${formData.audience.control}%` }} 
            />
            <div 
              className="h-full bg-brand-black transition-all" 
              style={{ width: `${formData.audience.holdout}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Audience Breakdown Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-medium text-brand-black tracking-tight">Customer groups</h3>
            <p className="text-gray-500 text-sm font-light">Manage segments and their delivery rules</p>
          </div>
          <button className="px-6 py-3 bg-brand-orange text-white rounded-2xl font-medium hover:bg-orange-600 text-xs uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add customer group
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            <div className="col-span-3">Name</div>
            <div className="col-span-9">Condition</div>
          </div>

          {/* AI Suggestion Row */}
          <div className="grid grid-cols-12 gap-6 p-6 bg-white border border-gray-100 rounded-3xl items-start shadow-sm group hover:border-orange-300 transition-all">
            <div className="col-span-3 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-brand-orange rounded-xl text-[10px] font-semibold uppercase">
                <Sparkles className="w-3 h-3 text-brand-orange" /> AI suggestion
              </div>
              <div className="p-3 bg-brand-orange/5 border border-brand-orange/10 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-brand-orange mt-0.5 shrink-0" />
                <span className="text-[10px] font-medium text-brand-orange leading-tight">Exclude at least 1 ML/AI Group</span>
              </div>
            </div>
            <div className="col-span-9 flex items-start gap-4">
              <div className="flex-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl tabular-nums text-[11px] leading-relaxed text-gray-500 min-h-[100px]">
                {formData.audience.description || "days_since_signup >= 64 AND is_excluded_l6 = FALSE AND is_unsubscribed_l6 = FALSE"}
              </div>
              <div className="p-3 text-gray-300">
                <Lock className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Control Group Row */}
          <div className="grid grid-cols-12 gap-6 p-6 bg-white border border-gray-100 rounded-3xl items-start shadow-sm group hover:border-slate-200 transition-all">
            <div className="col-span-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-semibold uppercase">
                Control Group
              </div>
            </div>
            <div className="col-span-9 flex items-start gap-4">
              <div className="flex-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl tabular-nums text-[11px] leading-relaxed text-gray-500 min-h-[100px]">
                WHERE customer_id ends WITH ('0', 'a', 'a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'b', 'ba', 'bb', 'bc', 'bd', 'be', 'bf', 'bg', 'bh', 'bi', 'bj', 'bk', 'bl', 'bm', 'bn', 'bo', 'bp', 'c')
              </div>
              <button className="p-3 text-gray-300 hover:text-red-400 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Holdout Group Row */}
          <div className="grid grid-cols-12 gap-6 p-6 bg-white border border-gray-100 rounded-3xl items-start shadow-sm group hover:border-brand-black/10 transition-all">
            <div className="col-span-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-black text-white rounded-xl text-[10px] font-semibold uppercase">
                Holdout Group
              </div>
            </div>
            <div className="col-span-9 flex items-start gap-4">
              <div className="flex-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl tabular-nums text-[11px] leading-relaxed text-gray-500 min-h-[100px]">
                WHERE customer_id ends WITH ('b0', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'ba', 'bb', 'bc', 'bd', 'be', 'bf', 'bg', 'bh', 'bi', 'bj', 'bk', 'bl', 'bm', 'bn', 'bo', 'bp', 'c')
              </div>
              <button className="p-3 text-gray-300 hover:text-red-400 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepActionBanks({ formData, setFormData }: { formData: UseCaseConfig, setFormData: any }) {
  const [activeTab, setActiveTab] = useState('Frequency');
  const tabs = ['Frequency', 'Days of Week', 'Channel', 'Offer', 'Time', 'Creative'];

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-4 text-sm font-semibold transition-all relative",
                activeTab === tab ? "text-brand-orange" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-orange" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden min-h-[400px]">
        {activeTab === 'Frequency' && (
          <div className="space-y-6">
            <div className="p-6 border-b border-gray-50 flex items-center justify-end bg-gray-50/30">
              <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-800 hover:bg-gray-50 transition-all shadow-sm">
                <Plus className="w-4 h-4" /> Add Frequency
              </button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Count</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Period</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {formData.actionBanks.frequencies.map(f => {
                  const descriptions: Record<string, string> = {
                    'FR001': 'One communication per week',
                    'FR002': 'Two communications per week',
                    'FR003': 'Three communications per week',
                    'FR004': 'One communication per day',
                  };
                  return (
                    <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-4 text-xs font-medium text-slate-400 tabular-nums italic">{f.id}</td>
                      <td className="px-8 py-4 text-sm font-medium text-slate-800">{f.name}</td>
                      <td className="px-8 py-4 text-sm text-slate-500 font-light">{descriptions[f.id] || '-'}</td>
                      <td className="px-8 py-4 text-sm tabular-nums text-slate-500">{f.count}</td>
                      <td className="px-8 py-4 text-sm tabular-nums text-slate-500">{f.period}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {activeTab !== 'Frequency' && (
          <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
            <div className="p-4 bg-slate-50 rounded-full">
              <Box className="w-8 h-8 text-slate-300" />
            </div>
            <div>
              <p className="text-slate-900 font-medium">{activeTab} Bank Configuration</p>
              <p className="text-sm text-slate-400 font-light">Manage and inventory available {activeTab.toLowerCase()} options.</p>
            </div>
            <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:opacity-90">
              Configure {activeTab}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StepDimensionsPartA({ formData, setFormData }: { formData: UseCaseConfig, setFormData: any }) {
  const toggleDimension = (id: string) => {
    const nextDims = formData.dimensions.map(d => d.id === id ? { ...d, enabled: !d.enabled } : d);
    setFormData({ ...formData, dimensions: nextDims });
  };

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h3 className="text-2xl font-medium text-brand-black tracking-tight">Decision Dimensions</h3>
        <p className="text-gray-500 font-light">Configure dimensions the AI agent is allowed to optimize.</p>
      </div>
      <div className="bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-semibold text-gray-400 uppercase tracking-widest w-12">#</th>
              <th className="px-6 py-4 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">DIMENSION</th>
              <th className="px-6 py-4 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">DESCRIPTION</th>
              <th className="px-6 py-4 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">SEND DECISIONS TO</th>
              <th className="px-6 py-4 text-[10px] font-semibold text-gray-400 uppercase tracking-widest text-center">ENABLED</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {formData.dimensions.map((dim, idx) => (
              <tr key={dim.id} className={cn("hover:bg-gray-50/50 transition-all", !dim.enabled && "opacity-40 grayscale")}>
                <td className="px-6 py-4 text-xs font-medium text-gray-300">
                  <GripVertical className="w-4 h-4 cursor-move" />
                </td>
                <td className="px-6 py-4 text-sm font-medium text-brand-black">{dim.name}</td>
                <td className="px-6 py-4 text-[13px] text-gray-500 font-light">{dim.description}</td>
                <td className="px-6 py-4 tabular-nums text-[11px] text-brand-orange">{dim.sendTo}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <input 
                      type="checkbox" 
                      checked={dim.enabled} 
                      onChange={() => toggleDimension(dim.id)}
                      className="w-4 h-4 rounded border-gray-200 text-brand-orange focus:ring-orange-200 cursor-pointer" 
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



function StepGuardrails({ formData, setFormData }: { formData: UseCaseConfig, setFormData: any }) {
  const caps = [
    { label: 'Daily Cap', field: 'dailyCap', sub: 'messages per user' },
    { label: 'Weekly Cap', field: 'weeklyCap', sub: 'messages per user' },
    { label: 'Monthly Cap', field: 'monthlyCap', sub: 'messages per user' },
  ];
  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h3 className="text-2xl font-medium text-brand-black tracking-tight">Guardrails & Constraints</h3>
        <p className="text-gray-500 font-light">Configure safety mechanisms and budget limits for the AI agent.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Daily Budget Cap (₹)</label>
              <input type="number" value={formData.guardrails.dailyBudget} onChange={e => setFormData({ ...formData, guardrails: { ...formData.guardrails, dailyBudget: parseInt(e.target.value) } })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:border-orange-300 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Total Use Case Budget (₹)</label>
              <input type="number" value={formData.guardrails.totalBudget} onChange={e => setFormData({ ...formData, guardrails: { ...formData.guardrails, totalBudget: parseInt(e.target.value) } })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:border-orange-300 outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {caps.map(c => (
              <div key={c.label} className="p-4 bg-white border border-gray-50 rounded-2xl space-y-2 shadow-sm">
                <label className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">{c.label}</label>
                <input type="number" value={formData.guardrails[c.field as keyof typeof formData.guardrails] as number} onChange={e => setFormData({ ...formData, guardrails: { ...formData.guardrails, [c.field]: parseInt(e.target.value) } })} className="w-full text-lg font-medium text-brand-black bg-transparent border-none p-0 focus:ring-0" />
                <p className="text-[9px] text-gray-400 italic font-light">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-[28px] p-8 space-y-6 shadow-sm">
              {[
                { label: 'TRAI Blockout (9PM - 9AM)', field: 'traiBlockout', desc: 'Auto-restrict all communications during silent hours.' },
                { label: 'DND / Blacklist Registry', field: 'dndEnforcement', desc: 'Sync and exclude national and internal Suppessions.' },
                { label: 'Rejection Cooling Period', field: 'rejectionCoolingEnabled', desc: 'Prevent re-offering the same partner after a rejection.' },
              ].map((rule) => (
                <div key={rule.field} className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-brand-black">{rule.label}</p>
                    <p className="text-xs text-gray-400 font-light">{rule.desc}</p>
                  </div>
                  <button onClick={() => setFormData({ ...formData, guardrails: { ...formData.guardrails, [rule.field]: !(formData.guardrails as any)[rule.field] } })} className={cn("w-10 h-5 rounded-full transition-all relative shrink-0", (formData.guardrails as any)[rule.field] ? "bg-brand-orange" : "bg-gray-200")}>
                    <div className={cn("absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm", (formData.guardrails as any)[rule.field] ? "right-0.5" : "left-0.5")} />
                  </button>
                </div>
              ))}
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="text-sm font-medium text-gray-500">Min. Message Gap (Hours)</span>
                <input type="number" value={formData.guardrails.minGap} onChange={e => setFormData({ ...formData, guardrails: { ...formData.guardrails, minGap: parseInt(e.target.value) } })} className="w-16 px-3 py-1.5 bg-gray-50 border border-gray-50 rounded-xl text-center font-medium text-sm focus:border-orange-300 outline-none" />
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepConversion({ formData, setFormData }: { formData: UseCaseConfig, setFormData: any }) {
  const events = ['AIP_submitted', 'Lead_generated', 'Form_completed', 'KYC_success', 'Disbursement_success'];
  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h3 className="text-2xl font-medium text-brand-black tracking-tight">Conversion & Success Metrics</h3>
        <p className="text-gray-500 font-light">Define how the AI agent measures success and optimizes reward functions.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Conversion Event</label>
              <select 
                value={formData.conversion.event} 
                onChange={e => setFormData({ ...formData, conversion: { ...formData.conversion, event: e.target.value } })} 
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium outline-none cursor-pointer appearance-none"
              >
                {events.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Event Timestamp Field</label>
              <input 
                type="text" 
                value={formData.conversion.timestampField} 
                onChange={e => setFormData({ ...formData, conversion: { ...formData.conversion, timestampField: e.target.value } })} 
                className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl text-sm tabular-nums focus:border-orange-300 outline-none" 
              />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-[28px] p-8 space-y-8 shadow-sm">
          <div className="space-y-4">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Optimize For</label>
            <div className="grid grid-cols-2 gap-4">
              {['Number', 'Value'].map(opt => (
                <button 
                  key={opt} 
                  onClick={() => setFormData({ ...formData, conversion: { ...formData.conversion, optimizeFor: opt as any } })} 
                  className={cn(
                    "py-4 rounded-2xl font-medium text-[10px] uppercase tracking-widest border transition-all", 
                    formData.conversion.optimizeFor === opt ? "bg-brand-black text-white border-brand-black shadow-lg" : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
                  )}
                >
                  {opt === 'Number' ? 'Number of Conversions' : 'Value of Conversions'}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Success Metric Name</label>
            <input 
              type="text" 
              value={formData.conversion.successMetricName} 
              onChange={e => setFormData({ ...formData, conversion: { ...formData.conversion, successMetricName: e.target.value } })} 
              className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:border-orange-300" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StepSummary({ formData }: { formData: UseCaseConfig }) {
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Review Configuration</h3>
        <span className="px-4 py-1.5 bg-brand-orange/10 text-brand-orange text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-2 border border-brand-orange/20">
          <Sparkles className="w-3 h-3" /> Ready for Launch
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Goal Card */}
        <div className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-sm space-y-8 group hover:border-orange-300 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-50 rounded-xl">
              <Target className="w-5 h-5 text-gray-400" />
            </div>
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Goal & Basic Info</h4>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Name</p>
              <p className="text-lg font-bold text-slate-900">{formData.goal.name}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Product</p>
              <p className="text-lg font-bold text-slate-900">{formData.goal.product}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Primary KPI</p>
              <p className="text-lg font-bold text-slate-900">{formData.goal.primaryKpi} Optimization</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Target Lift</p>
              <p className="text-lg font-bold text-brand-green">+{formData.goal.targetLift}%</p>
            </div>
          </div>
        </div>

        {/* Audience Card */}
        <div className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-sm space-y-8 group hover:border-orange-300 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-50 rounded-xl">
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Audience & Split</h4>
          </div>
          <div className="space-y-8">
            <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
              <p className="text-sm font-medium text-slate-600 italic leading-relaxed">
                "{formData.audience.description || "Users with credit score > 750, no active PL, active in last 30 days"}"
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-brand-green" /> Treatment {formData.audience.treatment}%</span>
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-300" /> Control {formData.audience.control}%</span>
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-100 border border-gray-200" /> Holdout {formData.audience.holdout}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden flex">
                <div className="h-full bg-brand-green" style={{ width: `${formData.audience.treatment}%` }} />
                <div className="h-full bg-gray-200" style={{ width: `${formData.audience.control}%` }} />
                <div className="h-full bg-slate-100" style={{ width: `${formData.audience.holdout}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Dimensions Card */}
        <div className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-sm space-y-8 group hover:border-orange-300 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-50 rounded-xl">
              <Brain className="w-5 h-5 text-gray-400" />
            </div>
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Optimization Dimensions</h4>
          </div>
          <div className="space-y-8">
            <div className="flex flex-wrap gap-2">
              {formData.dimensions.filter(d => d.enabled).map(dim => (
                <span key={dim.id} className="px-5 py-2.5 bg-orange-50 text-brand-orange rounded-xl text-xs font-bold border border-orange-100/50">
                  {dim.name}
                </span>
              ))}
            </div>
            <div className="space-y-4">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Available Action Space</p>
               <div className="grid grid-cols-3 gap-4">
                 <div className="space-y-1">
                   <p className="text-xl font-bold text-slate-900">{formData.actionBanks.channels.length}</p>
                   <p className="text-[10px] font-medium text-gray-400">Channels</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-xl font-bold text-slate-900">{formData.actionBanks.partners.length}</p>
                   <p className="text-[10px] font-medium text-gray-400">Partners</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-xl font-bold text-slate-900">{formData.actionBanks.creatives.length}</p>
                   <p className="text-[10px] font-medium text-gray-400">Creatives</p>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Guardrails Card */}
        <div className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-sm space-y-8 group hover:border-orange-300 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-50 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-gray-400" />
            </div>
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">System Guardrails</h4>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Daily Budget</p>
              <p className="text-lg font-bold text-slate-900">₹{formData.guardrails.dailyBudget.toLocaleString()}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Frequency Cap</p>
              <p className="text-lg font-bold text-slate-900">{formData.guardrails.dailyCap} msg / daily</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">TRAI Blockout</p>
              <p className="text-lg font-bold text-brand-green uppercase">Active</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Min Message Gap</p>
              <p className="text-lg font-bold text-slate-900">{formData.guardrails.minGap} Hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


