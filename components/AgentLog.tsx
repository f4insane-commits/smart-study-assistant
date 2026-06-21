"use client";
import { useState, useEffect } from "react";
import { type AgentLog } from "@/lib/agents/core";
import { Terminal, Brain, Server, Shield, Activity, BarChart, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const agentIcons = { Orchestrator: Server, Analyzer: Brain, QuestionGen: Shield, Explainer: Activity, ProgressTracker: BarChart };
const agentColors = {
  Orchestrator: "text-indigo-400 bg-white/5 border-white/10",
  Analyzer: "text-purple-400 bg-white/5 border-white/10",
  QuestionGen: "text-pink-400 bg-white/5 border-white/10",
  Explainer: "text-emerald-400 bg-white/5 border-white/10",
  ProgressTracker: "text-amber-400 bg-white/5 border-white/10",
};

export default function AgentLogPanel({ logs }: { logs: AgentLog[] }) {
  const [visibleLogs, setVisibleLogs] = useState<AgentLog[]>([]);
  useEffect(() => {
    if (logs.length === 0) return;
    if (logs[0].id !== visibleLogs[0]?.id && logs.length > visibleLogs.length) {
       setVisibleLogs([]); let i = 0;
       const interval = setInterval(() => {
         if (i < logs.length) { setVisibleLogs(prev => [...prev, logs[i]]); i++; }
         else clearInterval(interval);
       }, 400); 
       return () => clearInterval(interval);
    }
  }, [logs]);

  return (
    <div className="flex flex-col glass rounded-2xl overflow-hidden h-full">
      <div className="flex items-center gap-2 p-4 border-b border-white/10 bg-white/5">
        <Terminal className="w-5 h-5 text-slate-400" />
        <h3 className="font-heading font-medium text-slate-200">System Logs</h3>
        <span className="ml-auto flex items-center gap-2 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold tracking-wider">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> ACTIVE
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm max-h-[500px]">
        {visibleLogs.length === 0 && <div className="text-slate-600 text-center py-8">Waiting for agent activity...</div>}
        {visibleLogs.map((log) => {
          const Icon = agentIcons[log.agent]; const colorClasses = agentColors[log.agent];
          return (
            <div key={log.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border glass", colorClasses)}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 pt-1.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn("font-semibold text-xs tracking-wider", colorClasses.split(' ')[0])}>{log.agent}</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-slate-300 leading-relaxed font-sans">{log.message}</p>
                {log.status === 'error' && <span className="inline-block mt-1 text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20">ERR_FAULT</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
