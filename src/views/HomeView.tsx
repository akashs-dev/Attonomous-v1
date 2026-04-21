import React from 'react';
import { 
  ArrowRight, 
  Layers, 
  Workflow, 
  Send, 
  BarChart, 
  Sparkles,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';
import Button from '../components/ui/Button';

interface HomeCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  statusText?: string;
  buttonText?: string;
  isComingSoon?: boolean;
  onClick?: () => void;
}

function HomeCard({ 
  title, 
  description, 
  icon: Icon, 
  iconColor, 
  statusText, 
  buttonText, 
  isComingSoon,
  onClick 
}: HomeCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[12px] p-8 border border-brand-border shadow-sm hover:shadow-md transition-all h-full flex flex-col relative"
    >
      {isComingSoon && (
        <div className="absolute top-8 right-8">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-brand-bg-light text-brand-gray-light border border-dotted border-brand-border rounded-full">
            Coming Soon
          </span>
        </div>
      )}
      
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${iconColor}`}>
        <Icon className="w-6 h-6" />
      </div>
      
      <h3 className="text-lg font-semibold text-brand-black mb-3 tracking-tight">{title}</h3>
      <p className="text-brand-gray-dark text-sm leading-relaxed mb-6 flex-grow">
        {description}
      </p>
      
      {statusText && (
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-4 h-4 text-brand-green" />
          <span className="text-xs font-semibold text-brand-green">{statusText}</span>
        </div>
      )}
      
      {buttonText ? (
        <Button 
          variant="primary"
          onClick={onClick}
          icon={<ArrowRight className="w-4 h-4" />}
          className="w-fit"
        >
          {buttonText}
        </Button>
      ) : (
        <p className="text-xs text-brand-gray-light font-medium italic">Available in a future release.</p>
      )}
    </motion.div>
  );
}

export default function HomeView({ onNavigate }: { onNavigate: (view: string) => void }) {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-brand-bg-light p-12 lg:p-20">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-[24px] font-semibold text-brand-black tracking-tight mb-3">
            Welcome back, Shashank
          </h1>
          <p className="text-brand-gray-dark text-lg font-normal">
            Your AI-Powered Decisioning Hub is active and optimizing.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <HomeCard
            title="Decisioning"
            description="AI-driven campaign decisioning engine. Automatically route the right message to the right segment using reinforcement learning."
            icon={Workflow}
            iconColor="bg-green-50 text-brand-green border border-green-100"
            buttonText="Open Decisioning"
            onClick={() => onNavigate('setup')}
          />
          <HomeCard
            title="Content Studio"
            description="Generate on-brand push notification content with AI. Review variants, score compliance, and approve for delivery."
            icon={Layers}
            iconColor="bg-green-50 text-brand-green border border-green-100"
            statusText="12 approved this month"
            buttonText="Open Content Studio"
            onClick={() => onNavigate('content')}
          />
          <HomeCard
            title="Campaign Orchestration"
            description="Orchestrate and schedule approved campaigns across your CRM platform with precision timing."
            icon={Send}
            iconColor="bg-green-50 text-brand-green border border-green-100"
            buttonText="Open Campaigns"
            onClick={() => onNavigate('campaigns')}
          />
          <HomeCard
            title="Analytics"
            description="Measure content performance, incremental lift, and compliance scores in real-time."
            icon={BarChart}
            iconColor="bg-green-50 text-brand-green border border-green-100"
            buttonText="Open Analytics"
            onClick={() => onNavigate('analytics')}
          />
        </div>
        
        <div className="mt-20 pt-12 border-t border-brand-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-brand-gray-light text-[12px] font-medium uppercase tracking-widest">
            <span className="hover:text-brand-orange cursor-pointer transition-colors">Platform Status</span>
            <span className="hover:text-brand-orange cursor-pointer transition-colors">Release Notes</span>
            <span className="hover:text-brand-orange cursor-pointer transition-colors">Support</span>
          </div>
          <div className="relative w-full max-w-xs transition-all group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-light group-focus-within:text-brand-orange transition-colors" />
            <input 
              type="text" 
              placeholder="Search documentation..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-brand-border rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-brand-orange/10 focus:border-brand-orange transition-all shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

