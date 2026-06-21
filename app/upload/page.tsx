"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, File, Loader2, Sparkles, AlertCircle } from "lucide-react";
import AgentLogPanel from "@/components/AgentLog";
import { type AgentLog } from "@/lib/agents/core";
import { cn } from "@/lib/utils";

export default function UploadPage() {
  const router = useRouter(); const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false); const [logs, setLogs] = useState<AgentLog[]>([]);
  const [loading, setLoading] = useState(false); const [error, setError] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
  };
  const processFile = async () => {
    if (!file) return; setLoading(true); setError(null); setLogs([]);
    const formData = new FormData(); formData.append("file", file); formData.append("userId", "demo_user");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.logs) setLogs(data.logs);
      if (!res.ok) throw new Error(data.error || "Failed to process");
      setTimeout(() => { router.push(`/quiz/${data.quizId}`); }, 4000);
    } catch (err: any) { setError(err.message); setLoading(false); }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white">Knowledge Upload</h1>
        <p className="text-slate-400 mt-2">Feed raw documents into the multi-agent system for processing.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
        <div className="flex flex-col gap-6">
          <div
            className={cn(
              "flex-1 border-2 border-dashed border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center transition-all glass relative overflow-hidden group",
              isDragging ? "border-indigo-500 bg-white/10" : "hover:border-white/20 hover:bg-white/5",
              loading && "opacity-50 pointer-events-none"
            )}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}
          >
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-10 h-10 text-indigo-400" />
            </div>
            {file ? (
              <div className="text-center z-10">
                <File className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <p className="text-xl font-medium text-slate-200">{file.name}</p>
                <button onClick={() => setFile(null)} className="mt-4 text-sm text-red-400 hover:text-red-300 transition-colors">Remove file</button>
              </div>
            ) : (
              <div className="text-center z-10">
                <p className="text-xl font-medium text-slate-200">Drag & Drop Document</p>
                <label className="mt-6 inline-flex items-center justify-center px-6 py-3 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-colors text-sm font-medium text-slate-300">
                  <span>Browse Files</span>
                  <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </label>
              </div>
            )}
          </div>
          {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 text-red-400 items-start"><AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" /><p className="text-sm">{error}</p></div>}
          <button
            onClick={processFile} disabled={!file || loading}
            className={cn("w-full py-4 px-6 rounded-xl font-medium text-lg flex items-center justify-center gap-2 transition-all shadow-lg", !file || loading ? "bg-white/5 text-slate-500 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/30 hover:shadow-indigo-500/50")}
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing via Multi-Agent Core...</> : <><Sparkles className="w-5 h-5" /> Initialize Analysis</>}
          </button>
        </div>
        <div className="h-[600px] lg:h-full"><AgentLogPanel logs={logs} /></div>
      </div>
    </div>
  );
}
