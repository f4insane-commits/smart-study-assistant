"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutDashboard, BrainCircuit, LineChart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Upload & Analyze", icon: FileText },
  { href: "/quiz", label: "Quizzes", icon: BrainCircuit },
  { href: "/progress", label: "Progress", icon: LineChart },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 glass border-r border-white/10 z-10 flex flex-col h-full flex-shrink-0">
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white shadow-lg">S</div>
        <h1 className="font-bold text-lg tracking-tight">SmartStudy <span className="text-indigo-400">AI</span></h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all group cursor-pointer",
                active
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  active ? "text-white" : "text-slate-400 group-hover:text-white"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-6 mt-auto">
        <div className="glass rounded-2xl p-4">
          <div className="text-xs text-indigo-400 font-semibold mb-1 uppercase tracking-wider">System Status</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-sm text-slate-300">5 Agents Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
