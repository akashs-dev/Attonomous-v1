import React, { useState } from 'react';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  ShieldAlert,
  Brain,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Cell,
  Legend
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

// --- Mock Data ---

const dashboardData = {
  Daily: {
    kpis: [
      { label: 'Users at Cap', value: '1,240', change: '+2.4%', trend: 'up', color: 'text-red-600' },
      { label: 'Users Nearing Cap', value: '8,500', change: '-1.2%', trend: 'down', color: 'text-amber-600' },
      { label: 'Total Violations', value: '42', change: '+5.1%', trend: 'up', color: 'text-red-600' },
      { label: 'Compliance Rate', value: '99.8%', change: '+0.02%', trend: 'up', color: 'text-green-600' },
    ],
    utilization: [
      { range: '0 msgs', count: 45000 },
      { range: '1 msg', count: 25000 },
      { range: '2 msgs', count: 15000 },
      { range: '3 msgs', count: 8000 },
      { range: '4 msgs', count: 3000 },
      { range: '5 msgs', count: 1240 },
      { range: '5+ msgs', count: 42 },
    ],
    trend: Array.from({ length: 14 }, (_, i) => ({
      date: `Apr ${i + 1}`,
      violations: Math.floor(Math.random() * 50) + 10,
    })),
    channelViolations: [
      { name: 'WhatsApp', value: 25 },
      { name: 'SMS', value: 12 },
      { name: 'RCS', value: 5 },
      { name: 'Email', value: 0 },
    ],
    recommendations: [
      "Daily WhatsApp cap for 'High Intent' segment is being reached by 15% of users. Consider increasing cap to 4 or optimizing frequency.",
      "TRAI blockout violations detected (3 instances). Check system clock synchronization for SMS gateway.",
      "Engagement drops significantly after 3 daily messages. Current cap of 5 might be too high for general segments."
    ]
  },
  Weekly: {
    kpis: [
      { label: 'Users at Cap', value: '4,800', change: '+1.8%', trend: 'up', color: 'text-red-600' },
      { label: 'Users Nearing Cap', value: '12,400', change: '+0.5%', trend: 'up', color: 'text-amber-600' },
      { label: 'Total Violations', value: '156', change: '-3.2%', trend: 'down', color: 'text-red-600' },
      { label: 'Compliance Rate', value: '99.5%', change: '+0.05%', trend: 'up', color: 'text-green-600' },
    ],
    utilization: [
      { range: '0-5', count: 60000 },
      { range: '6-10', count: 20000 },
      { range: '11-15', count: 10000 },
      { range: '16-20', count: 5000 },
      { range: '21-25', count: 4800 },
      { range: '25+', count: 156 },
    ],
    trend: Array.from({ length: 8 }, (_, i) => ({
      date: `Week ${i + 1}`,
      violations: Math.floor(Math.random() * 100) + 50,
    })),
    channelViolations: [
      { name: 'WhatsApp', value: 85 },
      { name: 'SMS', value: 45 },
      { name: 'RCS', value: 20 },
      { name: 'Email', value: 6 },
    ],
    recommendations: [
      "Weekly frequency for 'Dormant' users exceeds 10 messages. This correlates with a 12% increase in opt-outs.",
      "SMS channel shows consistent compliance. RCS utilization is low, consider shifting budget for rich media engagement.",
      "Cap of 25 messages/week is reached primarily by the 'Power Users' segment without negative impact on conversion."
    ]
  },
  Monthly: {
    kpis: [
      { label: 'Users at Cap', value: '12,500', change: '+4.5%', trend: 'up', color: 'text-red-600' },
      { label: 'Users Nearing Cap', value: '35,000', change: '+2.1%', trend: 'up', color: 'text-amber-600' },
      { label: 'Total Violations', value: '480', change: '+12%', trend: 'up', color: 'text-red-600' },
      { label: 'Compliance Rate', value: '98.9%', change: '-0.1%', trend: 'down', color: 'text-green-600' },
    ],
    utilization: [
      { range: '0-10', count: 80000 },
      { range: '11-20', count: 40000 },
      { range: '21-30', count: 20000 },
      { range: '31-40', count: 15000 },
      { range: '41-50', count: 12500 },
      { range: '50+', count: 480 },
    ],
    trend: Array.from({ length: 6 }, (_, i) => ({
      date: `Month ${i + 1}`,
      violations: Math.floor(Math.random() * 200) + 100,
    })),
    channelViolations: [
      { name: 'WhatsApp', value: 280 },
      { name: 'SMS', value: 120 },
      { name: 'RCS', value: 65 },
      { name: 'Email', value: 15 },
    ],
    recommendations: [
      "Monthly fatigue detected in 'Tier 2' cities. Recommend reducing monthly cap from 50 to 40 for this demographic.",
      "Email violations are negligible. WhatsApp remains the highest risk channel for policy breaches.",
      "RL engine is successfully prioritizing high-value offers as users approach monthly caps."
    ]
  }
};

export default function GovernanceDashboard() {
  const [view, setView] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const data = dashboardData[view];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-32">
      {/* Header & View Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Governance Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time monitoring of policy compliance and cap utilization.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            {(['Daily', 'Weekly', 'Monthly'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "px-4 py-2 text-xs font-bold rounded-lg transition-all",
                  view === v ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                {v}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className={cn(
                "p-2 rounded-xl",
                kpi.label === 'Users at Cap' ? "bg-red-50" :
                kpi.label === 'Users Nearing Cap' ? "bg-amber-50" :
                kpi.label === 'Total Violations' ? "bg-red-50" : "bg-green-50"
              )}>
                {kpi.label === 'Users at Cap' ? <ShieldAlert className="w-5 h-5 text-red-600" /> :
                 kpi.label === 'Users Nearing Cap' ? <AlertTriangle className="w-5 h-5 text-amber-600" /> :
                 kpi.label === 'Total Violations' ? <AlertTriangle className="w-5 h-5 text-red-600" /> :
                 <CheckCircle2 className="w-5 h-5 text-green-600" />}
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold",
                kpi.trend === 'up' ? "text-red-600" : "text-green-600"
              )}>
                {kpi.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.change}
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{kpi.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cap Utilization Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Cap Utilization</h3>
              <p className="text-xs text-gray-500">Distribution of messages per user ({view})</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-black rounded-sm" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">User Count</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.utilization} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="range" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {data.utilization.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === data.utilization.length - 1 ? '#ef4444' : index === data.utilization.length - 2 ? '#f59e0b' : '#000000'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Violations by Channel */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Violations by Channel</h3>
            <p className="text-xs text-gray-500">Breakdown of breaches ({view})</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={data.channelViolations} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#374151' }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Violation Trend */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Violation Trend</h3>
            <p className="text-xs text-gray-500">Historical trend of policy breaches</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="violations" 
                  stroke="#ef4444" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-black text-white p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Brain className="w-32 h-32" />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold">Policy Recommendations</h3>
            </div>
            <div className="space-y-4">
              {data.recommendations.map((rec, i) => (
                <div key={i} className="flex gap-3 group cursor-pointer">
                  <div className="w-1.5 h-1.5 bg-white/30 rounded-full mt-2 group-hover:bg-white transition-all" />
                  <p className="text-sm text-gray-300 leading-relaxed group-hover:text-white transition-all">{rec}</p>
                </div>
              ))}
            </div>
            <button className="w-full py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
              Apply Optimization
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
