import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Wallet, 
  Users, 
  ChevronRight, 
  Plus, 
  MoreHorizontal, 
  Pause, 
  Play, 
  Copy, 
  Edit3, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Calendar,
  Zap,
  Brain,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  FileText,
  Edit,
  Box,
  ShieldCheck,
  Settings,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Activity,
  Trash2,
  PieChart,
  Search,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

import UseCaseSetup from './UseCaseSetup';
import DecisionLog from './DecisionLog';
import CampaignCalendar from './CampaignCalendar';
import AnalyticsView from './AnalyticsView';
import { UseCase, UseCaseStatus } from '../types/use-case';
import { mockUseCases } from '../data/mock-use-cases';

export default function UseCaseManagement({ 
  subView,
  onCreateNew, 
  onSubViewChange 
}: { 
  subView: string;
  onCreateNew: () => void; 
  onSubViewChange: (sub: string) => void 
}) {
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardMode, setWizardMode] = useState<'create' | 'edit'>('create');
  const [useCases, setUseCases] = useState<UseCase[]>(mockUseCases);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UseCaseStatus | 'All'>('All');

  useEffect(() => {
    if (subView === 'wizard') {
      setIsWizardOpen(true);
    } else if (subView === 'use-case-list') {
      setIsWizardOpen(false);
      setSelectedUseCase(null);
    }
  }, [subView]);

  const handleCreateNew = () => {
    setWizardMode('create');
    setIsWizardOpen(true);
    onSubViewChange('wizard');
  };

  const handleEdit = (uc: UseCase) => {
    setSelectedUseCase(uc);
    setWizardMode('edit');
    setIsWizardOpen(true);
    onSubViewChange('wizard');
  };

  const [showApplyModal, setShowApplyModal] = useState(false);

  const handleCompleteWizard = (data: any) => {
    if (wizardMode === 'edit') {
      setShowApplyModal(true);
    } else {
      setIsWizardOpen(false);
      onSubViewChange('use-case-list');
    }
  };

  const applyChanges = (immediate: boolean) => {
    setIsWizardOpen(false);
    setShowApplyModal(false);
    onSubViewChange(selectedUseCase ? 'overview' : 'use-case-list');
    // In real app, schedule or apply immediately
  };

  const handleSelectUseCase = (uc: UseCase) => {
    setSelectedUseCase(uc);
    onSubViewChange('overview');
  };

  const handlePause = (ucId: string) => {
    if (window.confirm("Pausing will stop all campaigns from this use case. Are you sure?")) {
      setUseCases(prev => prev.map(uc => uc.id === ucId ? { ...uc, status: 'Paused', dailyDecisions: 0 } : uc));
    }
  };

  const handleResume = (ucId: string) => {
    setUseCases(prev => prev.map(uc => uc.id === ucId ? { ...uc, status: 'Active', dailyDecisions: 125000 } : uc));
  };

  const filteredUseCases = useCases.filter(uc => {
    const matchesSearch = uc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || uc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isWizardOpen) {
    return (
      <>
        <UseCaseSetup 
          initialData={wizardMode === 'edit' ? selectedUseCase?.config : undefined}
          onCancel={() => {
            setIsWizardOpen(false);
            onSubViewChange(selectedUseCase ? 'overview' : 'use-case-list');
          }} 
          onComplete={handleCompleteWizard} 
        />
        <AnimatePresence>
          {showApplyModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-[32px] p-10 max-w-lg w-full shadow-2xl space-y-8"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Apply Strategy Changes?</h3>
                  <p className="text-gray-500">You have modified the active strategy blueprint. How would you like to proceed?</p>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 font-medium">Applying changes immediately will regenerate tonight's scheduled campaigns based on the new dimensions and banks.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => applyChanges(true)}
                    className="w-full py-4 bg-brand-orange text-white rounded-2xl font-black hover:bg-orange-600 transition-all"
                  >
                    Apply Now
                  </button>
                  <button 
                    onClick={() => applyChanges(false)}
                    className="w-full py-4 bg-white border border-gray-200 text-gray-600 rounded-2xl font-black hover:bg-gray-50 transition-all"
                  >
                    Schedule for Next Cycle
                  </button>
                  <button 
                    onClick={() => setShowApplyModal(false)}
                    className="w-full py-2 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-gray-600"
                  >
                    Go Back
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </>
    );
  }

  if (selectedUseCase && subView !== 'use-case-list') {
    return (
      <UseCaseDetail 
        useCase={useCases.find(u => u.id === selectedUseCase.id) || selectedUseCase} 
        onBack={() => {
          setSelectedUseCase(null);
          onSubViewChange('use-case-list');
        }} 
        onEdit={() => handleEdit(selectedUseCase)}
        onPause={() => handlePause(selectedUseCase.id)}
        onResume={() => handleResume(selectedUseCase.id)}
        subView={subView}
        onSubViewChange={onSubViewChange}
      />
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 pb-32 bg-brand-bg-light">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-[32px] font-bold text-brand-black tracking-tight leading-tight">Optimization Strategies</h2>
          <p className="text-brand-gray-dark text-[16px] font-medium tracking-tight">Manage and monitor your autonomous optimization flows.</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-8 py-4 bg-brand-orange text-white rounded-2xl font-black hover:bg-orange-600 transition-all shrink-0"
        >
          <Plus className="w-5 h-5" />
          Create New Use Case
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-2 border border-brand-border rounded-2xl shadow-sm">
        <div className="flex-1 flex items-center gap-3 px-4">
          <Search className="w-5 h-5 text-brand-gray-light" />
          <input 
            type="text" 
            placeholder="Search use cases..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full py-3 bg-transparent border-none focus:ring-0 text-sm font-semibold text-brand-black placeholder:text-brand-gray-light" 
          />
        </div>
        <div className="h-8 w-px bg-brand-border hidden md:block" />
        <div className="flex items-center gap-2 px-2">
          {['All', 'Active', 'Paused', 'Draft', 'Completed'].map(status => (
            <button 
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-wider",
                statusFilter === status 
                  ? "bg-brand-black text-white" 
                  : "text-brand-gray-light hover:text-brand-black"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredUseCases.map((uc) => (
          <UseCaseCard 
            key={uc.id} 
            useCase={uc} 
            onClick={() => handleSelectUseCase(uc)}
            onEdit={() => handleEdit(uc)}
            onPause={() => handlePause(uc.id)}
            onResume={() => handleResume(uc.id)}
          />
        ))}
      </div>
    </div>
  );
}

function UseCaseCard({ useCase, onClick, onEdit, onPause, onResume }: any) {
  const progress = (useCase.kpiProgress / useCase.kpiTarget) * 100;
  const budgetProgress = (useCase.budgetSpent / useCase.budgetTotal) * 100;

  return (
    <div className="bg-white border border-brand-border rounded-[24px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:border-brand-orange/30 hover:shadow-xl transition-all group flex flex-col h-full relative overflow-hidden">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="space-y-2 cursor-pointer flex-1" onClick={onClick}>
          <div className="flex items-center gap-3">
            <h3 className="text-[20px] font-bold text-brand-black tracking-tight group-hover:text-brand-orange transition-colors line-clamp-1">{useCase.name}</h3>
            <span className={cn(
              "px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest shrink-0",
              useCase.status === 'Active' ? "bg-green-50 text-green-700 border-green-100" :
              useCase.status === 'Paused' ? "bg-amber-50 text-amber-700 border-amber-100" :
              useCase.status === 'Draft' ? "bg-gray-50 text-gray-500 border-gray-100" :
              "bg-orange-50 text-orange-700 border-orange-100"
            )}>
              {useCase.status}
            </span>
          </div>
          <p className="text-sm font-medium text-brand-gray-dark tracking-tight">{useCase.product} • {useCase.primaryGoal}</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onEdit} className="p-2 hover:bg-brand-bg-light rounded-xl transition-all text-brand-gray-light hover:text-brand-orange" title="Edit">
            <Edit3 className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-brand-bg-light rounded-xl transition-all text-brand-gray-light hover:text-brand-orange" title="Clone">
            <Copy className="w-5 h-5" />
          </button>
          {useCase.status === 'Active' ? (
            <button onClick={onPause} className="p-2 hover:bg-brand-orange/10 rounded-xl transition-all text-brand-gray-light hover:text-brand-orange" title="Pause">
              <Pause className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={onResume} className="p-2 hover:bg-brand-green/10 rounded-xl transition-all text-brand-gray-light hover:text-brand-green" title="Resume">
              <Play className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-10 mb-10 cursor-pointer" onClick={onClick}>
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <p className="text-[10px] font-bold text-brand-gray-light uppercase tracking-widest">KPI Progress</p>
            <p className="text-sm font-bold text-brand-orange">+{useCase.kpiProgress}% <span className="text-brand-gray-light font-medium">/ +{useCase.kpiTarget}%</span></p>
          </div>
          <div className="h-2 bg-brand-bg-light rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              className="h-full bg-brand-orange rounded-full shadow-[0_0_8px_rgba(249,115,22,0.3)]"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <p className="text-[10px] font-bold text-brand-gray-light uppercase tracking-widest">Budget Spent</p>
            <p className="text-sm font-bold text-brand-black">₹{(useCase.budgetSpent / 100000).toFixed(1)}L <span className="text-brand-gray-light font-medium">/ ₹{(useCase.budgetTotal / 100000).toFixed(1)}L</span></p>
          </div>
          <div className="h-2 bg-brand-bg-light rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${budgetProgress}%` }}
              className="h-full bg-brand-black rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-8 border-t border-brand-border mt-auto cursor-pointer" onClick={onClick}>
        <div className="flex items-center gap-8">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-brand-gray-light uppercase tracking-widest">Audience</p>
            <div className="flex items-center gap-2 text-[14px] font-semibold text-brand-black">
              <Users className="w-4 h-4 text-brand-gray-light" />
              {useCase.audienceSize.toLocaleString()}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-brand-gray-light uppercase tracking-widest">Daily Decisions</p>
            <div className="flex items-center gap-2 text-[14px] font-semibold text-brand-black">
              <Zap className="w-4 h-4 text-brand-orange" />
              {useCase.dailyDecisions.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="text-right space-y-2">
          <p className="text-[9px] font-bold text-brand-gray-light uppercase tracking-widest">Ends: {useCase.endDate}</p>
          <button className="px-6 py-2 bg-brand-orange text-white rounded-xl text-xs font-black active:scale-95 transition-all">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

function UseCaseDetail({ useCase, onBack, onEdit, onPause, onResume, subView, onSubViewChange }: any) {
  const tabs = ['Overview', 'Configuration', 'Campaigns', 'Decisions', 'Analytics'];
  const activeTab = subView === 'overview' ? 'Overview' : 
                   subView === 'configuration' ? 'Configuration' :
                   subView === 'campaigns' ? 'Campaigns' :
                   subView === 'decisions' ? 'Decisions' :
                   subView === 'analytics' ? 'Analytics' : 'Overview';

  return (
    <div className="h-full flex flex-col">
      {/* Detail Header */}
      <div className="bg-white border-b border-gray-100 px-10 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button 
                onClick={onBack}
                className="p-3 hover:bg-gray-100 rounded-2xl transition-all"
              >
                <ChevronLeft className="w-6 h-6 text-gray-500" />
              </button>
              <div>
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">{useCase.name}</h2>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest",
                    useCase.status === 'Active' ? "bg-green-50 text-green-700 border-green-100" :
                    useCase.status === 'Paused' ? "bg-amber-50 text-amber-700 border-amber-100" :
                    "bg-gray-50 text-gray-400"
                  )}>
                    {useCase.status}
                  </span>
                </div>
                <p className="text-base font-bold text-gray-500 mt-1">End Date: {useCase.endDate} • {useCase.product} Optimization</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onEdit} className="px-6 py-3 bg-white border border-gray-200 rounded-2xl text-gray-500 hover:text-gray-900 transition-all font-black text-xs uppercase tracking-widest">Clone</button>
              <button className="px-6 py-3 bg-white border border-gray-200 rounded-2xl text-gray-500 hover:text-gray-900 transition-all font-black text-xs uppercase tracking-widest">Delete</button>
              {useCase.status === 'Active' ? (
                 <button onClick={onPause} className="px-6 py-3 bg-white border border-red-100 rounded-2xl text-red-600 font-bold hover:bg-red-50 transition-all">Pause Use Case</button>
              ) : (
                <button onClick={onResume} className="px-6 py-3 bg-green-600 rounded-2xl text-white font-bold hover:bg-green-700 transition-all">Resume Use Case</button>
              )}
              <button onClick={onEdit} className="px-8 py-3 bg-brand-orange text-white rounded-2xl font-black hover:bg-orange-600 transition-all">Edit Strategy</button>
            </div>
          </div>

          <div className="flex items-center gap-12 pt-4">
            {tabs.map(tab => (
              <button 
                key={tab} 
                onClick={() => onSubViewChange(tab.toLowerCase())}
                className={cn(
                  "pb-4 text-sm font-black transition-all relative",
                  activeTab === tab ? "text-brand-orange" : "text-gray-400 hover:text-gray-600"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="tabUnderline" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-orange rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Content */}
      <div className="flex-1 overflow-y-auto bg-[#F9F9F7]">
        <div className="max-w-7xl mx-auto p-10 h-full">
          {activeTab === 'Overview' && <UseCasePerformanceOverview useCase={useCase} />}
          {activeTab === 'Configuration' && <UseCaseConfigSummary useCase={useCase} onEdit={onEdit} />}
          {activeTab === 'Decisions' && <DecisionLog hideHeader={true} useCaseId={useCase.id} />}
          {activeTab === 'Campaigns' && <UseCaseCampaignsGrid useCase={useCase} />}
          {activeTab === 'Analytics' && <AnalyticsView subView="overview" />}
        </div>
      </div>
    </div>
  );
}

function UseCasePerformanceOverview({ useCase }: { useCase: UseCase }) {
  const progressCards = [
    {
      title: 'Time Progress',
      current: '14',
      target: '30',
      suffix: 'Days',
      label: 'Days passed vs total',
      percentage: 46,
      status: 'On Track',
      statusColor: 'bg-green-500',
      icon: Clock,
      trend: '+2 days vs plan',
      trendUp: true,
      color: 'text-brand-orange',
      barColor: 'bg-brand-orange'
    },
    {
      title: 'Budget Progress',
      current: '₹12.4L',
      target: '₹40.0L',
      suffix: '',
      label: 'Spent vs total budget',
      percentage: 31,
      status: 'Healthy',
      statusColor: 'bg-green-500',
      icon: Wallet,
      trend: '-₹1.2L vs forecast',
      trendUp: false,
      color: 'text-slate-900',
      barColor: 'bg-slate-900'
    },
    {
      title: 'KPI (AIP) Progress',
      current: '118,500',
      target: '150,000',
      suffix: '',
      label: 'AIP achieved vs target',
      percentage: 79,
      status: 'Ahead',
      statusColor: 'bg-green-500',
      icon: Zap,
      trend: '+12% above pace',
      trendUp: true,
      color: 'text-brand-green',
      barColor: 'bg-brand-green'
    },
    {
      title: 'Remaining Targets',
      current: '31,500',
      target: '150,000',
      suffix: 'AIP',
      label: 'KPI yet to be achieved',
      percentage: 21,
      status: 'Low Risk',
      statusColor: 'bg-brand-green',
      icon: Target,
      trend: '1,968 per day needed',
      trendUp: false,
      color: 'text-brand-orange',
      barColor: 'bg-brand-orange'
    }
  ];

  return (
    <div className="space-y-10 mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {progressCards.map((card, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-sm space-y-10 group hover:border-gray-200 transition-all">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors">
                  <card.icon className={cn("w-5 h-5", card.color)} />
                </div>
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{card.title}</h4>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full">
                <div className={cn("w-1.5 h-1.5 rounded-full", card.statusColor)} />
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{card.status}</span>
              </div>
            </div>

            {/* Values */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">{card.current}</span>
                <span className="text-lg font-medium text-gray-300">/ {card.target}</span>
                {card.suffix && <span className="text-xs font-bold text-gray-400 uppercase ml-1">{card.suffix}</span>}
              </div>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tight">{card.label}</p>
            </div>

            {/* Progress Bar Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-400 tracking-tight">Completion</span>
                <span className="text-slate-900">{card.percentage}%</span>
              </div>
              <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${card.percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={cn("h-full rounded-full transition-all", card.barColor)}
                />
              </div>
            </div>

            {/* Footer / Trend */}
            <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
              <div className={cn("flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-tight", 
                card.trendUp ? "text-green-600" : "text-slate-500"
              )}>
                {card.trendUp ? <TrendingUp className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
                {card.trend}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UseCaseConfigSummary({ useCase, onEdit }: any) {
  return (
    <div className="space-y-10">
       <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Active Configuration</h3>
          <button onClick={onEdit} className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-sm font-black text-gray-600 hover:text-gray-900 transition-all">Edit Config</button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white border border-gray-100 rounded-[32px] p-8 space-y-6 shadow-sm">
             <div className="flex items-center gap-3"><Target className="w-5 h-5 text-gray-900"/><h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Goal & Basic Info</h4></div>
             <div className="grid grid-cols-2 gap-4">
                <div><p className="text-[10px] text-gray-400 uppercase tracking-widest">Name</p><p className="text-sm font-black text-gray-900">{useCase.name}</p></div>
                <div><p className="text-[10px] text-gray-400 uppercase tracking-widest">Product</p><p className="text-sm font-black text-gray-900">{useCase.product}</p></div>
                <div><p className="text-[10px] text-gray-400 uppercase tracking-widest">Primary KPI</p><p className="text-sm font-black text-gray-900">{useCase.primaryGoal}</p></div>
                <div><p className="text-[10px] text-gray-400 uppercase tracking-widest">Target Lift</p><p className="text-sm font-black text-brand-orange">+{useCase.kpiTarget}%</p></div>
             </div>
          </section>
          <section className="bg-white border border-gray-100 rounded-[32px] p-8 space-y-6 shadow-sm">
             <div className="flex items-center gap-3"><Users className="w-5 h-5 text-brand-orange"/><h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Audience & Split</h4></div>
             <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-2xl"><p className="text-xs font-bold text-gray-400 uppercase mb-2">Definition</p><p className="text-sm font-bold text-gray-900 italic">"Users with credit score {">"} 750, no active PL, active in last 30 days"</p></div>
                <div className="flex items-center gap-4">
                   <div className="flex-1"><div className="flex justify-between text-xs font-black mb-1"><span>Treatment</span><span>80%</span></div><div className="h-2 bg-brand-orange rounded-full w-full"/></div>
                   <div className="flex-1"><div className="flex justify-between text-xs font-black mb-1"><span>Control</span><span>10%</span></div><div className="h-2 bg-gray-300 rounded-full w-full"/></div>
                   <div className="flex-1"><div className="flex justify-between text-xs font-black mb-1"><span>Holdout</span><span>10%</span></div><div className="h-2 bg-gray-100 rounded-full w-full"/></div>
                </div>
             </div>
          </section>
          <section className="bg-white border border-gray-100 rounded-[32px] p-8 space-y-6 shadow-sm">
             <div className="flex items-center gap-3"><Brain className="w-5 h-5 text-brand-orange"/><h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Optimization Dimensions</h4></div>
             <div className="flex flex-wrap gap-2">
                {['Channel', 'Frequency', 'Partner', 'Time', 'Creative'].map(d => (
                  <span key={d} className="px-4 py-2 bg-orange-50 text-brand-orange border border-orange-100 rounded-xl text-xs font-black">{d}</span>
                ))}
             </div>
             <div className="pt-4 border-t border-gray-50 space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available Action Space</p>
                <div className="flex gap-4">
                   <div className="text-center"><p className="text-[10px] text-gray-400">Channels</p><p className="text-sm font-black text-gray-900">3</p></div>
                   <div className="text-center"><p className="text-[10px] text-gray-400">Partners</p><p className="text-sm font-black text-gray-900">6</p></div>
                   <div className="text-center"><p className="text-[10px] text-gray-400">Creatives</p><p className="text-sm font-black text-gray-900">4</p></div>
                </div>
             </div>
          </section>
          <section className="bg-white border border-gray-100 rounded-[32px] p-8 space-y-6 shadow-sm">
             <div className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-green-600"/><h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">System Guardrails</h4></div>
             <div className="grid grid-cols-2 gap-6">
                <div><p className="text-[10px] text-gray-400 uppercase">Daily Budget</p><p className="text-sm font-black text-gray-900">₹5,00,000</p></div>
                <div><p className="text-[10px] text-gray-400 uppercase">Frequency Cap</p><p className="text-sm font-black text-gray-900">5 msg / daily</p></div>
                <div><p className="text-[10px] text-gray-400 uppercase">TRAI Blockout</p><p className="text-sm font-black text-green-600 uppercase">Active</p></div>
                <div><p className="text-[10px] text-gray-400 uppercase">Min Message Gap</p><p className="text-sm font-black text-gray-900">12 Hours</p></div>
             </div>
          </section>
          <section className="bg-white border border-gray-100 rounded-[32px] p-8 space-y-6 shadow-sm">
             <div className="flex items-center gap-3"><Zap className="w-5 h-5 text-amber-600"/><h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Success Attribution</h4></div>
             <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-sm text-gray-500 font-bold">Conversion Event</span><span className="text-sm font-black text-gray-900">AIP_submitted</span></div>
                <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-sm text-gray-500 font-bold">Optimize Goal</span><span className="text-sm font-black text-gray-900">Net Conversion Value</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-500 font-bold">Success Metric</span><span className="text-sm font-black text-brand-orange">Inc. Monthly Revenue</span></div>
             </div>
          </section>
       </div>
    </div>
  );
}

function UseCaseCampaignsGrid({ useCase }: { useCase: UseCase }) {
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
          <div>
             <h3 className="text-2xl font-black text-gray-900 tracking-tight">Active Campaigns</h3>
             <p className="text-sm font-bold text-gray-500">Live experiments generated by this strategy.</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-2 bg-brand-orange text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:bg-orange-600">
             <Plus className="w-4 h-4" /> New Manual Ad-hoc
          </button>
       </div>
       <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
          <table className="w-full text-left">
             <thead className="bg-gray-50/50">
                <tr className="border-b border-gray-100">
                   <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Campaign Name</th>
                   <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Channel</th>
                   <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Users</th>
                   <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Spend</th>
                   <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
                {[
                  { name: 'WA_AIP_HighIntent_Ev', channel: 'WhatsApp', users: 124500, spend: '₹4,20,000', status: 'Running' },
                  { name: 'SMS_AIP_PriceSens_Mor', channel: 'SMS', users: 84000, spend: '₹84,000', status: 'Running' },
                  { name: 'RCS_AIP_TechSavy_Aft', channel: 'RCS', users: 5200, spend: '₹12,400', status: 'Running' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
                     <td className="px-8 py-6 text-sm font-black text-gray-900 group-hover:text-brand-orange">{row.name}</td>
                     <td className="px-8 py-6"><span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black text-gray-600 border border-gray-200">{row.channel}</span></td>
                     <td className="px-8 py-6 text-sm font-black text-gray-500 tabular-nums">{row.users.toLocaleString()}</td>
                     <td className="px-8 py-6 text-sm font-black text-gray-900">{row.spend}</td>
                     <td className="px-8 py-6"><span className="px-3 py-1 bg-green-50 rounded-full text-[10px] font-black text-green-600 border border-green-100">RUNNING</span></td>
                  </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
}
