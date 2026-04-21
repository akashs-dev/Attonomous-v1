import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, X, ArrowUpRight, Check, History, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';
import { ViewType } from './Sidebar';
import { SelectionState } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  hasAction?: boolean;
}

interface CopilotPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: ViewType;
  subView?: string;
  initialQuery?: string;
  selection: SelectionState;
  activeChannel?: 'All Channels' | 'WhatsApp' | 'SMS' | 'RCS';
}

export default function CopilotPanel({ isOpen, onClose, activeView, subView, initialQuery, selection, activeChannel }: CopilotPanelProps) {
  const getInitialMessage = () => {
    let role = "AI Decisioning Copilot";
    let content = "Hello! I'm your AI Decisioning Copilot. How can I help you optimize your engine today?";
    const totalSelected = selection.partners.length + selection.campaigns.length;

    if (activeView === 'home') {
      role = "Platform Concierge";
      content = "Welcome back! I'm your Platform Concierge. I can give you a quick summary of your engine's health, explain recent approvals, or help you navigate to specific tools. How can I assist you today?";
    } else if (activeView === 'campaigns') {
      if (totalSelected > 0) {
        role = `Campaign Designer (${totalSelected} selected)`;
        const partnerText = selection.partners.length > 0 ? `Partners: ${selection.partners.join(', ')}` : '';
        const campaignText = selection.campaigns.length > 0 ? `Campaigns: ${selection.campaigns.map(c => c.name).join(', ')}` : '';
        content = `I've loaded your selection: ${[partnerText, campaignText].filter(Boolean).join(' | ')}. I can help you redesign these strategies, simulate outcomes, or generate new content variants. What would you like to build?`;
      } else {
        role = "Campaign Architect";
        content = "I'm ready to help you create or optimize your next campaign. Tell me your goal, like 'Create a WhatsApp campaign for high-value dormant users,' and I'll handle the segment, channel, and timing logic.";
      }
    } else if (activeView === 'analytics') {
      role = "Analytics Agent";
      content = "I'm your Analytics Agent. I can explain performance trends, identify drivers of lift/drop, and recommend budget reallocation. What's the goal?";
    } else if (activeView === 'governance-dashboard') {
      role = "Governance Agent";
      content = "I'm your Governance Agent. I can explain why users were blocked, suggest frequency cap changes, or show DND/blacklist statistics. How can I secure your engine?";
    } else if (activeView === 'setup') {
      if (subView === 'wizard') {
        role = "Setup Assistant";
        content = "I'm your Setup Assistant. I can help you define audience segments, suggest guardrails, and optimize your decision dimensions. How can I help?";
      } else if (subView === 'use-case-overview') {
        role = "Performance Analyst";
        content = "I'm your Performance Analyst. I can explain KPI trends, recommend budget reallocations, and analyze RL engine performance. What analysis do you need?";
      } else {
        role = "Strategy Assistant";
        content = "I'm your Strategy Assistant. I can suggest new use cases based on your data or identify underperforming strategies. What's on your mind?";
      }
    }

    return { role, content };
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: getInitialMessage().content,
    }
  ]);

  // Reset messages when context changes significantly
  useEffect(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: getInitialMessage().content,
      }
    ]);
  }, [activeView, subView, selection.partners.length, selection.campaigns.length]);

  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && initialQuery) {
      handleSend(initialQuery);
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text: string = input) => {
    const query = text.trim();
    if (!query) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setHistory(prev => [query, ...prev.filter(h => h !== query)].slice(0, 3));
    setInput('');

    // Mock response
    setTimeout(() => {
      let content = `Based on the current analysis, this action is predicted to improve your target KPI by 4.2% while maintaining the ₹50L budget constraint.`;
      let hasAction = query.toLowerCase().includes('optimize') || query.toLowerCase().includes('merge') || query.toLowerCase().includes('whatsapp') || query.toLowerCase().includes('reallocation') || query.toLowerCase().includes('drop') || query.toLowerCase().includes('template') || query.toLowerCase().includes('variation');
      
      if (subView === 'wizard' && query.toLowerCase().includes('audience')) {
        content = `To define a high-performing audience for this PL AIP use case, I recommend: "Users with credit score > 720, no active PL loan, and at least 2 app sessions in the last 7 days". 
        
        This segment historically shows a 12% higher conversion rate. Would you like to apply this?`;
      } else if (subView === 'use-case-list' && query.toLowerCase().includes('new')) {
        content = `Based on your current data, I suggest a new Use Case: "Increase Credit Card Upgrades for Gold Segment". 
        
        We see a 22% increase in eligibility for this group, but only 4% conversion. AI optimization could drive a +12% lift here.`;
      } else if (subView === 'use-case-overview' && query.toLowerCase().includes('why')) {
        content = `AIP is down 3% this week primarily due to a slowdown in the 'Price Sensitive' segment. 
        
        Recommendation: Reallocate ₹1.5L from SMS to WhatsApp for this segment, as WhatsApp is showing 2x better engagement for them currently.`;
      } else if (subView === 'use-case-decisions' && query.toLowerCase().includes('why')) {
        content = `User USR_8821 was given 'Do Nothing' because:
        1. Frequency cap reached (5 messages this week).
        2. Predicted lift for WhatsApp was only 0.2% due to recent negative sentiment.
        3. Governance rule: 'Minimum 48h gap' was active.`;
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: content,
        hasAction: hasAction
      };
      setMessages(prev => [...prev, assistantMsg]);
    }, 1000);
  };

  const useCaseListActions = [
    "Suggest a new use case based on my data",
    "Identify underperforming use cases",
    "What's the top priority for optimization?",
    "Show me use cases with budget alerts"
  ];

  const segmentsActions = [
    "Build a segment for 'High Intent users in Mumbai'",
    "Explain the logic for WA_BFL_Exclusive",
    "Merge 'Dormant' and 'Price Sensitive' segments",
    "Split 'Credit Card' segment by income level"
  ];

  const campaignsPlannerActions = [
    "Suggest focus for tomorrow",
    "Recommend budget allocation",
    "What should I do tomorrow?",
    "Analyze audience overlap"
  ];

  const campaignsEditorActions = [
    "Why is this campaign underperforming?",
    "Suggest channel and time changes",
    "Edit campaign parameters",
    "Explain audience overlap for this campaign"
  ];

  const analyticsActions = [
    "Explain performance trends",
    "Identify drivers of last week's drop",
    "Recommend budget reallocation for +5% lift",
    "Compare RL performance vs baseline"
  ];

  const governanceActions = [
    "Why were 12k users blocked yesterday?",
    "Suggest frequency cap changes",
    "Show DND/blacklist statistics",
    "Identify governance bottlenecks"
  ];

  const standardActions = [
    "Explain this table",
    "Optimize for lower cost",
    "What changed since yesterday?"
  ];

  const homeActions = [
    "Summarize engine health",
    "Show recent approvals",
    "What's the next priority?",
    "Show platform status"
  ];

  const quickActions = 
    activeView === 'home' ? homeActions :
    activeView === 'campaigns' ? (selection.partners.length > 0 || selection.campaigns.length > 0 ? campaignsEditorActions : campaignsPlannerActions) :
    activeView === 'analytics' ? analyticsActions :
    activeView === 'governance-dashboard' ? governanceActions :
    subView === 'use-case-list' ? useCaseListActions :
    standardActions;

  const getSuggestedPrompt = () => {
    if (activeView === 'home') return "Summarize my engine health";
    
    const hasSelection = selection.partners.length > 0 || selection.campaigns.length > 0;

    switch (activeView) {
      case 'campaigns': return hasSelection ? "Compare these selected items" : "Suggest focus for tomorrow";
      case 'analytics': return "Explain performance trends for last 30 days";
      case 'governance-dashboard': return "Explain why users were blocked yesterday";
      case 'setup': 
        if (subView === 'use-case-list') return "Suggest a new use case based on my data";
        return "How can I improve my current optimization?";
      default: return "How can I improve my current optimization?";
    }
  };

  const roleText = getInitialMessage().role;
  const hasSelection = selection.partners.length > 0 || selection.campaigns.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 w-[70vw] max-w-full h-full bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-brand-border flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-orange/10 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand-orange" />
              </div>
              <div>
                <h2 className="text-[16px] font-semibold text-brand-black leading-none">
                  {roleText}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <p className="text-[10px] text-brand-gray-light uppercase font-bold tracking-widest">
                    AI Active · {activeView === 'home' ? "Platform" : activeView.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-brand-bg-light rounded-full transition-colors text-brand-gray-light hover:text-brand-orange">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto bg-brand-bg-light/30">
            <div className="max-w-4xl mx-auto w-full p-8 space-y-8">
              {messages.length === 1 && (
                <div className="space-y-8 mt-12">
                  <div className="text-center space-y-3">
                    <h1 className="text-[28px] font-bold text-brand-black tracking-tight leading-tight">How can I help you today?</h1>
                    <p className="text-brand-gray-dark font-medium tracking-tight">Design, simulate, and launch campaigns with AI precision.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {quickActions.slice(0, 4).map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(action)}
                        className="p-6 rounded-2xl border border-brand-border bg-white hover:border-brand-orange hover:shadow-xl hover:-translate-y-1 transition-all text-left space-y-3 group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-brand-bg-light border border-brand-border flex items-center justify-center group-hover:border-brand-orange/30 transition-all">
                          <ArrowUpRight className="w-5 h-5 text-brand-gray-light group-hover:text-brand-orange" />
                        </div>
                        <p className="text-[14px] font-bold text-brand-black leading-snug">{action}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
                  <div className={cn(
                    "max-w-[85%] p-5 rounded-[20px] text-[14px] leading-relaxed shadow-sm",
                    msg.role === 'user' 
                      ? "bg-brand-black text-white rounded-tr-none" 
                      : "bg-white text-brand-gray-dark rounded-tl-none border border-brand-border"
                  )}>
                    {msg.content}
                    
                    {msg.role === 'assistant' && msg.id !== '1' && (
                      <div className="mt-4 pt-4 border-t border-brand-border flex items-center gap-4">
                        {msg.hasAction && (
                          <button className="flex items-center gap-2 text-[11px] font-bold text-white bg-brand-orange px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors uppercase tracking-wider shadow-sm">
                            <Check className="w-4 h-4" />
                            Execute Campaign
                          </button>
                        )}
                        <button className="flex items-center gap-2 text-[11px] font-bold text-brand-gray-light hover:text-brand-orange uppercase tracking-wider transition-colors">
                          <ExternalLink className="w-4 h-4" />
                          View Simulation Breakdown
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-8 border-t border-brand-border bg-white shrink-0">
            <div className="max-w-4xl mx-auto w-full">
              <div className="relative group">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask your Campaign Architect..."
                  rows={1}
                  className="w-full pl-6 pr-16 py-5 bg-brand-bg-light border border-brand-border rounded-[20px] text-base focus:bg-white focus:ring-4 focus:ring-brand-orange/10 focus:border-brand-orange transition-all outline-none resize-none min-h-[64px] max-h-48 shadow-sm"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className={cn(
                    "absolute right-3 bottom-3 p-3 rounded-xl transition-all",
                    input.trim() 
                      ? "bg-brand-orange text-white hover:scale-105 active:scale-95 shadow-sm shadow-brand-orange/20" 
                      : "bg-brand-border text-brand-gray-light cursor-not-allowed"
                  )}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[10px] text-center text-brand-gray-light mt-6 font-bold uppercase tracking-[0.2em]">
                Attributics Decision Hub · v2.4.0
              </p>
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}

