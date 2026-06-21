"use client";
import { useEffect, useState } from "react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { Loader2, TrendingUp, Target, BrainCircuit, Activity } from "lucide-react";
import AgentLogPanel from "@/components/AgentLog";
import { type AgentLog } from "@/lib/agents/core";

export default function ProgressPage() {
  const [data, setData] = useState<any>(null); const [logs, setLogs] = useState<AgentLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/progress").then(res => res.json()).then(res => { setData(res.progress); if (res.logs) setLogs(res.logs); setLoading(false); });
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-indigo-500" /></div>;

  const chartData = Object.keys(data?.topicMastery || {}).map(topic => ({
    name: topic.substring(0, 15) + (topic.length > 15 ? '...' : ''), score: Math.round((data.topicMastery[topic].correct / data.topicMastery[topic].total) * 100)
  }));

  return (
    <div className="p-8 h-full flex flex-col overflow-y-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white">Neural Progress</h1>
        <p className="text-slate-400 mt-2">Analytical breakdown of your learning trajectory evaluated by the ProgressTracker Agent.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass border border-white/10 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10"><TrendingUp className="w-24 h-24" /></div>
          <p className="text-slate-400 font-medium mb-1 relative z-10 w-full">Global Accuracy</p>
          <p className="text-5xl font-heading font-bold text-white relative z-10">{data?.average || 0}%</p>
          <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm font-medium relative z-10"><Activity className="w-4 h-4" /> Trajectory Optimal</div>
        </div>
        <div className="glass border border-white/10 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10"><Target className="w-24 h-24" /></div>
          <p className="text-slate-400 font-medium mb-1 relative z-10">Total Questions</p>
          <p className="text-5xl font-heading font-bold text-white relative z-10">{data?.totalQuestions || 0}</p>
        </div>
        <div className="glass border border-white/10 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10"><BrainCircuit className="w-24 h-24" /></div>
          <p className="text-slate-400 font-medium mb-1 relative z-10">Topics Covered</p>
          <p className="text-5xl font-heading font-bold text-white relative z-10">{Object.keys(data?.topicMastery || {}).length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass border border-white/10 rounded-3xl p-8">
           <h3 className="text-xl font-heading font-semibold text-slate-200 mb-6">Topic Mastery Index</h3>
           {chartData.length > 0 ? (
             <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <RechartsLineChart data={chartData}>
                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                   <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                   <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                   <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ color: '#818cf8', fontWeight: 600 }} formatter={(val: number) => [`${val}%`, 'Accuracy']} />
                   <Line type="stepAfter" dataKey="score" stroke="#818cf8" strokeWidth={3} dot={{ r: 6, fill: '#818cf8', strokeWidth: 2, stroke: '#1e293b' }} activeDot={{ r: 8 }} />
                 </RechartsLineChart>
               </ResponsiveContainer>
             </div>
           ) : <div className="h-80 flex items-center justify-center text-slate-600 border-2 border-dashed border-white/10 rounded-2xl">Insufficient data to plot structural trajectory.</div>}
        </div>
        <div className="glass border border-white/10 rounded-3xl overflow-hidden h-[450px]">
           <AgentLogPanel logs={logs} />
        </div>
      </div>
    </div>
  );
}
