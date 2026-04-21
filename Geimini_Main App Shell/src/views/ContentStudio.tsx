import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  PenTool,
  Library as LibraryIcon,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BriefsList from '../studio/BriefsList';
import BriefDetail from '../studio/BriefDetail';
import WorkshopSetup from '../studio/WorkshopSetup';
import ContentLibrary from '../studio/ContentLibrary';
import LibraryEntry from '../studio/LibraryEntry';

interface ContentStudioProps {
  subView: string;
  onSubViewChange: (sub: string) => void;
  activeChannel: 'WhatsApp' | 'SMS' | 'RCS';
  onChannelChange: (ch: any) => void;
  onNavigate: (view: string, sub?: string) => void;
}

function StudioDashboard({ onNavigate }: { onNavigate: (sub: string) => void }) {
  return (
    <div className="p-12 max-w-6xl mx-auto space-y-12">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Content Studio</h1>
        <p className="text-gray-500 text-lg">Generate, review, and approve AI-powered push notification content.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Briefs Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col relative group"
        >
          <div className="absolute top-10 right-10">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-100 text-orange-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Clock className="w-3 h-3" />
              3 Pending
            </div>
          </div>

          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 border border-gray-100">
            <Briefcase className="w-7 h-7 text-gray-400" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">Briefs</h3>
          <p className="text-gray-500 leading-relaxed mb-10 flex-grow">
            Review content briefs sent from the Decisioning agent. Generate variants and approve for delivery.
          </p>

          <button
            onClick={() => onNavigate('briefs')}
            className="w-fit flex items-center gap-2 px-8 py-3.5 bg-brand-orange text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-all group-hover:gap-3"
          >
            View Briefs
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Workshop Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col group"
        >
          <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-8 border border-orange-100">
            <PenTool className="w-7 h-7 text-brand-orange" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">Workshop</h3>
          <p className="text-gray-500 leading-relaxed mb-10 flex-grow">
            Start a new content session without a brief. Describe your campaign and let AI generate on-brand variants.
          </p>

          <button
            onClick={() => onNavigate('workshop')}
            className="w-fit flex items-center gap-2 px-8 py-3.5 bg-brand-orange text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-all"
          >
            New Session
            <PenTool className="w-4 h-4 ml-1" />
          </button>
        </motion.div>
      </div>

      {/* Library Bar */}
      <motion.div
        whileHover={{ y: -2 }}
        onClick={() => onNavigate('library')}
        className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-4">
          <LibraryIcon className="w-5 h-5 text-gray-400" />
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-900">Content Library</span>
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="text-sm text-gray-500">8 approved entries</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-gray-400 group-hover:text-gray-900 transition-colors">
          View Library
          <ChevronRight className="w-4 h-4" />
        </div>
      </motion.div>
    </div>
  );
}

export default function ContentStudio({ subView, onSubViewChange }: ContentStudioProps) {
  const [briefDetailId, setBriefDetailId] = useState<number | null>(null)
  const [libraryEntryId, setLibraryEntryId] = useState<number | null>(null)

  // When the parent changes subView (e.g. user clicks a different sub-nav item),
  // clear nested drill-down state so the top-level screen shows
  useEffect(() => {
    setBriefDetailId(null)
    setLibraryEntryId(null)
  }, [subView])

  // Compute the active key for AnimatePresence
  const activeKey = briefDetailId !== null
    ? `brief-${briefDetailId}`
    : libraryEntryId !== null
    ? `library-entry-${libraryEntryId}`
    : subView

  const handleOpenBrief = (id: number) => {
    setBriefDetailId(id)
  }

  const handleBriefBack = () => {
    setBriefDetailId(null)
  }

  const handleBriefApproved = () => {
    setBriefDetailId(null)
    setLibraryEntryId(null)
    onSubViewChange('library')
  }

  const handleOpenEntry = (id: number) => {
    setLibraryEntryId(id)
  }

  const handleEntryBack = () => {
    setLibraryEntryId(null)
  }

  const handleViewLibrary = () => {
    setBriefDetailId(null)
    setLibraryEntryId(null)
    onSubViewChange('library')
  }

  const renderContent = () => {
    // Nested: Brief detail
    if (briefDetailId !== null) {
      return (
        <BriefDetail
          id={briefDetailId}
          onBack={handleBriefBack}
          onApproved={handleBriefApproved}
        />
      )
    }

    // Nested: Library entry
    if (libraryEntryId !== null) {
      return (
        <LibraryEntry
          id={libraryEntryId}
          onBack={handleEntryBack}
        />
      )
    }

    switch (subView) {
      case 'briefs':
        return (
          <BriefsList onOpenBrief={handleOpenBrief} />
        )
      case 'workshop':
        return (
          <WorkshopSetup onViewLibrary={handleViewLibrary} />
        )
      case 'library':
        return (
          <ContentLibrary onOpenEntry={handleOpenEntry} />
        )
      default:
        return (
          <StudioDashboard onNavigate={(sub) => {
            setBriefDetailId(null)
            setLibraryEntryId(null)
            onSubViewChange(sub)
          }} />
        )
    }
  }

  return (
    <div className="h-full bg-brand-bg-light overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeKey}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
