import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Layers, 
  Send, 
  BarChart, 
  Shield, 
  Sparkles,
  FileText,
  Plus,
  ChevronLeft,
  ChevronRight,
  Settings2,
  Calendar,
  Library,
  Briefcase,
  PenTool,
  Activity,
  Target,
  FilePieChart,
  List
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import AttributicsLogo from './AttributicsLogo';

export type ViewType = 'home' | 'setup' | 'campaigns' | 'analytics' | 'content' | 'governance-dashboard';

interface SidebarProps {
  activeView: ViewType;
  subView?: string;
  onViewChange: (view: ViewType, subView?: string) => void;
  onToggleCopilot: () => void;
}

export default function Sidebar({ activeView, subView, onViewChange, onToggleCopilot }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainItems = [
    { id: 'home', label: 'Home', icon: LayoutGrid },
    { id: 'setup', label: 'Decisioning', icon: Layers },
    { id: 'campaigns', label: 'Campaigns', icon: Send },
    { id: 'analytics', label: 'Analytics', icon: BarChart },
    { id: 'content', label: 'Content Studio', icon: FileText },
    { id: 'governance-dashboard', label: 'Governance', icon: Shield },
  ];

  const subMenus: Record<string, { label: string; items: { id: string; label: string; icon: any }[] }> = {
    setup: {
      label: 'DECISIONING',
      items: [
        { id: 'use-case-list', label: 'Strategies', icon: List },
        { id: 'wizard', label: 'Configure New Use Case', icon: Plus },
      ]
    },
    campaigns: {
      label: 'CAMPAIGNS',
      items: [
        { id: 'planner', label: 'Daily Decisions', icon: Target },
        { id: 'executed', label: 'Executed', icon: Calendar },
        { id: 'copilot', label: 'Create using AI Copilot', icon: Sparkles },
      ]
    },
    analytics: {
      label: 'ANALYTICS',
      items: [
        { id: 'dashboard', label: 'Overview', icon: BarChart },
        { id: 'lift', label: 'Lift Analysis', icon: Activity },
        { id: 'channels', label: 'Channels', icon: FilePieChart },
        { id: 'segments', label: 'Segments (AI)', icon: Layers },
      ]
    },
    content: {
      label: 'CONTENT STUDIO',
      items: [
        { id: 'briefs', label: 'Briefs', icon: Briefcase },
        { id: 'workshop', label: 'Workshop', icon: PenTool },
        { id: 'library', label: 'Library', icon: Library },
      ]
    },
    governance_dashboard: {
      label: 'GOVERNANCE',
      items: [
        { id: 'overview', label: 'Compliance', icon: Shield },
        { id: 'rules', label: 'Global Rules', icon: List },
      ]
    }
  };

  const activeSubMenu = subMenus[activeView === 'governance-dashboard' ? 'governance_dashboard' : activeView];

  return (
    <div className="flex h-full shadow-sm z-20">
      {/* Primary Rail (Light) */}
      <div className="w-16 flex-shrink-0 h-full bg-sidebar-bg flex flex-col items-center py-4 gap-4 border-r border-sidebar-border overflow-hidden">
        <div className="mb-6">
          <AttributicsLogo className="scale-75 origin-left ml-4" />
        </div>

        <div className="flex-1 w-full px-2 flex flex-col gap-2">
          {mainItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewType)}
              title={item.label}
              className={cn(
                "w-full aspect-square flex items-center justify-center rounded-lg transition-all duration-200 relative group",
                activeView === item.id
                  ? "bg-sidebar-active-bg text-sidebar-active-text"
                  : "text-gray-500 hover:text-orange-400 hover:bg-sidebar-hover"
              )}
            >
              <item.icon className="w-5 h-5" />
              {activeView === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-3/5 bg-brand-orange rounded-r-full" />
              )}
            </button>
          ))}
        </div>

        <button
          onClick={onToggleCopilot}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-orange-400 hover:bg-sidebar-hover transition-all"
        >
          <Sparkles className="w-5 h-5" />
        </button>

        <button className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:text-gray-300 hover:bg-sidebar-hover transition-all">
          <Settings2 className="w-5 h-5" />
        </button>
      </div>

      {/* Secondary Sidebar (Light) */}
      <AnimatePresence mode="wait">
        {activeSubMenu && !isCollapsed && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 220 }}
            exit={{ width: 0 }}
            className="h-full bg-white border-r border-gray-100 flex flex-col overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-[10px] font-semibold text-brand-gray-light uppercase tracking-[0.2em] mb-6">
                {activeSubMenu.label}
              </h2>
              
              <div className="flex flex-col gap-1.5">
                {activeSubMenu.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(activeView, item.id)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group border-l-2",
                      subView === item.id 
                        ? "text-brand-orange bg-sidebar-active-bg border-brand-orange" 
                        : "text-brand-gray-dark hover:text-brand-orange hover:bg-sidebar-hover border-transparent"
                    )}
                  >
                    <item.icon className={cn(
                      "w-4 h-4 transition-colors",
                      subView === item.id ? "text-brand-orange" : "text-brand-gray-light group-hover:text-brand-orange"
                    )} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-auto p-4 border-t border-sidebar-border">
              <button 
                onClick={() => setIsCollapsed(true)}
                className="flex items-center gap-2 text-[10px] font-semibold text-brand-gray-light hover:text-brand-orange transition-colors uppercase tracking-widest"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Collapse
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand Toggle if collapsed */}
      {isCollapsed && activeSubMenu && (
        <button 
          onClick={() => setIsCollapsed(false)}
          className="absolute left-16 top-1/2 -translate-y-1/2 w-6 h-12 bg-white border border-brand-border rounded-r-xl flex items-center justify-center text-brand-gray-light hover:text-brand-orange shadow-sm transition-all z-10"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

