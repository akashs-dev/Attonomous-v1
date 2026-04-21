import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, Filter, Download } from 'lucide-react';
import { cn } from '../lib/utils';
import SegmentsView from './SegmentsView';

const chartData = [
  { date: '01 Apr', baseline: 100, rl: 102 },
  { date: '05 Apr', baseline: 105, rl: 112 },
  { date: '10 Apr', baseline: 102, rl: 118 },
  { date: '15 Apr', baseline: 108, rl: 125 },
  { date: '20 Apr', baseline: 110, rl: 132 },
  { date: '25 Apr', baseline: 107, rl: 138 },
  { date: '30 Apr', baseline: 112, rl: 145 },
];

const channelData = [
  { channel: 'WhatsApp', users: 12345, conv: 980, cpaip: '₹42', ctr: '18.2%' },
  { channel: 'SMS', users: 4500, conv: 320, cpaip: '₹58', ctr: '12.4%' },
  { channel: 'Email', users: 890, conv: 45, cpaip: '₹12', ctr: '5.1%' },
  { channel: 'Push', users: 2100, conv: 110, cpaip: '₹8', ctr: '8.5%' },
];

const partnerData = [
  { partner: 'HDFC', users: 8500, conv: 620, cpaip: '₹45', ctr: '15.2%' },
  { partner: 'BFL', users: 4200, conv: 280, cpaip: '₹52', ctr: '11.8%' },
  { partner: 'ICICI', users: 3100, conv: 210, cpaip: '₹48', ctr: '13.5%' },
  { partner: 'Axis', users: 4035, conv: 345, cpaip: '₹41', ctr: '16.1%' },
];

const segmentData = [
  { segment: 'High Intent', users: 5200, conv: 510, cpaip: '₹38', ctr: '22.4%' },
  { segment: 'Price Sensitive', users: 7800, conv: 420, cpaip: '₹62', ctr: '10.2%' },
  { segment: 'Dormant', users: 4500, conv: 120, cpaip: '₹85', ctr: '4.8%' },
  { segment: 'New to Bank', users: 2335, conv: 405, cpaip: '₹32', ctr: '18.5%' },
];

export default function AnalyticsView({ subView }: { subView?: string }) {
  const [dateRange, setDateRange] = useState('Last 30 days');

  if (subView === 'segments') {
    return <SegmentsView onOpenCopilot={() => {}} />;
  }

  if (subView === 'lift') {
    return (
      <div className="p-12 flex flex-col items-center justify-center h-full text-center space-y-4 bg-brand-bg-light">
        <div className="w-16 h-16 bg-brand-orange/10 border border-brand-orange/20 rounded-2xl flex items-center justify-center mb-4">
          <TrendingUp className="w-8 h-8 text-brand-orange" />
        </div>
        <h2 className="text-[28px] font-bold text-brand-black tracking-tight">Incremental Lift Analysis</h2>
        <p className="text-brand-gray-dark max-w-sm font-normal">Statistically significant measurement of the autonomous agent's impact against BAU control groups.</p>
      </div>
    );
  }

  if (subView === 'channels') {
    return (
      <div className="p-12 flex flex-col items-center justify-center h-full text-center space-y-4 bg-brand-bg-light">
        <div className="w-16 h-16 bg-brand-green/10 border border-brand-green/20 rounded-2xl flex items-center justify-center mb-4">
          <Filter className="w-8 h-8 text-brand-green" />
        </div>
        <h2 className="text-[28px] font-bold text-brand-black tracking-tight">Channel Efficiency</h2>
        <p className="text-brand-gray-dark max-w-sm font-normal">Deep dive into channel-specific performance, conversion decay, and optimal frequency cap discovery.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-brand-bg-light h-full overflow-y-auto custom-scrollbar">
      {/* Header & Date Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[28px] font-bold text-brand-black tracking-tight leading-tight">Analytics & Performance</h2>
          <p className="text-brand-gray-dark text-sm font-normal">Comprehensive reporting on RL engine performance and campaign metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-brand-border rounded-lg px-4 py-2 shadow-sm">
            <Calendar className="w-4 h-4 text-brand-gray-light" />
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-sm font-medium text-brand-gray-dark bg-transparent border-none focus:ring-0 cursor-pointer"
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Custom Range</option>
            </select>
          </div>
          <button className="p-2 bg-white border border-brand-border rounded-lg text-brand-gray-light hover:border-brand-orange hover:text-brand-orange transition-all shadow-sm">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: "AIP Volume", value: "1,455", trend: "+12%", up: true },
          { label: "CPAIP", value: "₹48.2", trend: "-4%", up: true },
          { label: "CTR", value: "14.8%", trend: "+2.1%", up: true },
          { label: "Total Spend", value: "₹12.4L", trend: "+8%", up: false },
          { label: "Incremental Lift", value: "+35%", trend: "↑ 5%", up: true },
        ].map((kpi, i) => (
          <div key={i} className="p-5 bg-white border border-brand-border rounded-[12px] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <p className="text-[10px] font-bold text-brand-gray-light uppercase tracking-wider mb-1">{kpi.label}</p>
            <p className="text-[28px] font-bold text-brand-black leading-none mb-2">{kpi.value}</p>
            <div className={cn(
              "text-[10px] font-bold flex items-center gap-1",
              kpi.up ? "text-brand-green" : "text-brand-orange"
            )}>
              {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {kpi.trend} vs last period
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="p-6 bg-white border border-brand-border rounded-[12px] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-semibold text-brand-black text-base">RL Engine vs Baseline Performance</h3>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-brand-orange rounded-full" />
              <span className="text-[12px] text-brand-gray-dark font-semibold">RL Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-brand-green rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
              <span className="text-[12px] text-brand-gray-dark font-semibold">Baseline</span>
            </div>
          </div>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#9CA3AF', fontWeight: 500}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#9CA3AF', fontWeight: 500}} 
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#111827',
                  padding: '12px'
                }}
                itemStyle={{ color: '#FFFFFF', fontSize: '12px', fontWeight: 600 }}
                labelStyle={{ color: '#9CA3AF', fontSize: '11px', marginBottom: '4px', fontWeight: 600 }}
              />
              <Line 
                type="monotone" 
                dataKey="rl" 
                stroke="#F97316" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#F97316', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} 
              />
              <Line 
                type="monotone" 
                dataKey="baseline" 
                stroke="#10B981" 
                strokeWidth={2} 
                strokeDasharray="5 5" 
                dot={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance by Channel */}
        <div className="bg-white border border-brand-border rounded-[12px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="px-6 py-4 border-b border-brand-border bg-brand-bg-light/50">
            <h3 className="font-semibold text-brand-black text-sm">Performance by Channel</h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border bg-brand-bg-light/30">
                <th className="px-6 py-3 text-[10px] font-bold text-brand-gray-light uppercase tracking-wider">Channel</th>
                <th className="px-6 py-3 text-[10px] font-bold text-brand-gray-light uppercase tracking-wider text-right">Users</th>
                <th className="px-6 py-3 text-[10px] font-bold text-brand-gray-light uppercase tracking-wider text-right">Conv</th>
                <th className="px-6 py-3 text-[10px] font-bold text-brand-gray-light uppercase tracking-wider text-right">CPAIP</th>
                <th className="px-6 py-3 text-[10px] font-bold text-brand-gray-light uppercase tracking-wider text-right">CTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {channelData.map((row, i) => (
                <tr key={i} className="hover:bg-brand-bg-light transition-colors group">
                  <td className="px-6 py-3 text-[14px] font-medium text-brand-gray-dark group-hover:text-brand-orange">{row.channel}</td>
                  <td className="px-6 py-3 text-[14px] text-brand-gray-dark text-right tabular-nums">{row.users.toLocaleString()}</td>
                  <td className="px-6 py-3 text-[14px] text-brand-gray-dark text-right tabular-nums">{row.conv}</td>
                  <td className="px-6 py-3 text-[14px] text-brand-gray-dark text-right tabular-nums">{row.cpaip}</td>
                  <td className="px-6 py-3 text-[14px] font-bold text-brand-green text-right">{row.ctr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Performance by Partner */}
        <div className="bg-white border border-brand-border rounded-[12px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="px-6 py-4 border-b border-brand-border bg-brand-bg-light/50">
            <h3 className="font-semibold text-brand-black text-sm">Performance by Partner</h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border bg-brand-bg-light/30">
                <th className="px-6 py-3 text-[10px] font-bold text-brand-gray-light uppercase tracking-wider">Partner</th>
                <th className="px-6 py-3 text-[10px] font-bold text-brand-gray-light uppercase tracking-wider text-right">Users</th>
                <th className="px-6 py-3 text-[10px] font-bold text-brand-gray-light uppercase tracking-wider text-right">Conv</th>
                <th className="px-6 py-3 text-[10px] font-bold text-brand-gray-light uppercase tracking-wider text-right">CPAIP</th>
                <th className="px-6 py-3 text-[10px] font-bold text-brand-gray-light uppercase tracking-wider text-right">CTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {partnerData.map((row, i) => (
                <tr key={i} className="hover:bg-brand-bg-light transition-colors group">
                  <td className="px-6 py-3 text-[14px] font-medium text-brand-gray-dark group-hover:text-brand-orange">{row.partner}</td>
                  <td className="px-6 py-3 text-[14px] text-brand-gray-dark text-right tabular-nums">{row.users.toLocaleString()}</td>
                  <td className="px-6 py-3 text-[14px] text-brand-gray-dark text-right tabular-nums">{row.conv}</td>
                  <td className="px-6 py-3 text-[14px] text-brand-gray-dark text-right tabular-nums">{row.cpaip}</td>
                  <td className="px-6 py-3 text-[14px] font-bold text-brand-green text-right">{row.ctr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Performance by Segment */}
        <div className="bg-white border border-brand-border rounded-[12px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-brand-border bg-brand-bg-light/50">
            <h3 className="font-semibold text-brand-black text-sm">Performance by Segment</h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border bg-brand-bg-light/30">
                <th className="px-6 py-3 text-[10px] font-bold text-brand-gray-light uppercase tracking-wider">Segment</th>
                <th className="px-6 py-3 text-[10px] font-bold text-brand-gray-light uppercase tracking-wider text-right">Users</th>
                <th className="px-6 py-3 text-[10px] font-bold text-brand-gray-light uppercase tracking-wider text-right">Conv</th>
                <th className="px-6 py-3 text-[10px] font-bold text-brand-gray-light uppercase tracking-wider text-right">CPAIP</th>
                <th className="px-6 py-3 text-[10px] font-bold text-brand-gray-light uppercase tracking-wider text-right">CTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {segmentData.map((row, i) => (
                <tr key={i} className="hover:bg-brand-bg-light transition-colors group">
                  <td className="px-6 py-3 text-[14px] font-medium text-brand-gray-dark group-hover:text-brand-orange">{row.segment}</td>
                  <td className="px-6 py-3 text-[14px] text-brand-gray-dark text-right tabular-nums">{row.users.toLocaleString()}</td>
                  <td className="px-6 py-3 text-[14px] text-brand-gray-dark text-right tabular-nums">{row.conv}</td>
                  <td className="px-6 py-3 text-[14px] text-brand-gray-dark text-right tabular-nums">{row.cpaip}</td>
                  <td className="px-6 py-3 text-[14px] font-bold text-brand-green text-right">{row.ctr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
