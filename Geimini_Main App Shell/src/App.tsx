/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Sidebar, { ViewType } from './components/Sidebar';
import CopilotPanel from './components/CopilotPanel';
import UseCaseSetup from './views/UseCaseSetup';
import UseCaseManagement from './views/UseCaseManagement';
import SegmentsView from './views/SegmentsView';
import CampaignBundler from './views/CampaignBundler';
import AnalyticsView from './views/AnalyticsView';
import ContentStudio from './views/ContentStudio';
import GovernanceConfig from './views/GovernanceConfig';
import GovernanceDashboard from './views/GovernanceDashboard';
import HomeView from './views/HomeView';
import CampaignCalendar from './views/CampaignCalendar';
import { motion, AnimatePresence } from 'motion/react';
import { SelectionState } from './types';

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [subView, setSubView] = useState<string>('');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotQuery, setCopilotQuery] = useState<string | undefined>(undefined);
  const [selection, setSelection] = useState<SelectionState>({ partners: [], campaigns: [] });
  const [activeChannel, setActiveChannel] = useState<'All Channels' | 'WhatsApp' | 'SMS' | 'RCS'>('All Channels');

  const handleNavigate = (view: string, sub?: string) => {
    const viewType = view as ViewType;
    setActiveView(viewType);
    
    if (sub) {
      setSubView(sub);
    } else {
      // Set sensible defaults when switching main views
      const subViewDefaults: Record<string, string> = {
        'setup': 'use-case-list',
        'campaigns': 'planner',
        'analytics': 'dashboard',
        'content': 'overview',
        'governance-dashboard': 'overview'
      };
      setSubView(subViewDefaults[view] || '');
    }
    
    setSelection({ partners: [], campaigns: [] });
    setActiveChannel('All Channels');
    setIsWizardOpen(false);
  };

  const renderView = () => {
    if (isWizardOpen) {
      return (
        <UseCaseSetup 
          onCancel={() => {
            setIsWizardOpen(false);
            setSubView('use-case-list');
          }} 
          onComplete={() => {
            setIsWizardOpen(false);
            setSubView('use-case-list');
          }} 
        />
      );
    }

    switch (activeView) {
      case 'home': return <HomeView onNavigate={handleNavigate} />;
      case 'setup': return (
        <UseCaseManagement 
          subView={subView}
          onCreateNew={() => {
            setIsWizardOpen(true);
            setSubView('wizard');
          }} 
          onSubViewChange={setSubView}
        />
      );
      case 'campaigns': 
        if (subView === 'executed') {
          return (
            <CampaignCalendar 
              onSelectCampaign={(campaignId) => {
                setSelection({ partners: [], campaigns: [{ id: campaignId, name: 'Selected Campaign', channel: 'WhatsApp', status: 'Live', spend: '0', users: 0, partner: 'BFL', templateId: '', templateName: '' }] });
                setSubView('planner');
              }} 
            />
          );
        }
        return (
          <CampaignBundler 
            subView={subView}
            onSubViewChange={setSubView}
            activeChannel={activeChannel}
            onChannelChange={setActiveChannel}
            onOpenCopilot={(query) => {
              setCopilotQuery(query);
              setIsCopilotOpen(true);
            }}
            onSelectionChange={setSelection}
            onSetupUseCase={() => {
              setIsWizardOpen(true);
              setSubView('wizard');
            }}
          />
        );
      case 'content': return (
        <ContentStudio 
          subView={subView || 'overview'} 
          onSubViewChange={setSubView} 
          activeChannel={activeChannel === 'All Channels' ? 'WhatsApp' : activeChannel as any} 
          onChannelChange={setActiveChannel} 
          onNavigate={handleNavigate}
        />
      );
      case 'analytics': return <AnalyticsView subView={subView} />;
      case 'governance-dashboard': 
        if (subView === 'rules') return <GovernanceConfig onBack={() => setSubView('overview')} />;
        return <GovernanceDashboard />;
      default: return <HomeView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen bg-brand-bg-light text-brand-black font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        activeView={activeView} 
        subView={subView}
        onViewChange={(view, sub) => {
          if (sub === 'copilot') {
            setIsCopilotOpen(true);
            setCopilotQuery("Help me create a new campaign");
            // Default to campaigns planner when copilot is requested from menu
            handleNavigate('campaigns', 'planner');
          } else {
            handleNavigate(view, sub);
          }
        }} 
        onToggleCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Copilot Panel */}
      <CopilotPanel 
        isOpen={isCopilotOpen} 
        onClose={() => {
          setIsCopilotOpen(false);
          setCopilotQuery(undefined);
        }} 
        activeView={activeView}
        subView={subView}
        initialQuery={copilotQuery}
        selection={selection}
        activeChannel={activeChannel}
      />

      {/* Global Overlay for Copilot */}
      {isCopilotOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCopilotOpen(false)}
          className="fixed inset-0 bg-black/5 backdrop-blur-[1px] z-40"
        />
      )}
    </div>
  );
}

