import Link from "next/link";
import { ArrowRight, Brain, Activity, UploadCloud } from "lucide-react";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="p-8 lg:p-12 h-full flex flex-col overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full">
        {/* Hero Section */}
        <div className="relative rounded-[2rem] overflow-hidden glass border border-white/10 p-10 lg:p-16 mb-8 group">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
          
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight">
              Master complex topics with an autonomous AI swarm.
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-xl">
              Upload study materials and watch specialized agents break down documentation, formulate quizzes, and pinpoint exactly where you need to focus.
            </p>
            <div className="flex gap-4">
              <Link 
                href="/upload" 
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg"
              >
                Upload Material <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-3xl p-6 border border-white/10 hover:bg-white/5 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">
               <UploadCloud className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-2">Automated Parsing</h3>
            <p className="text-slate-400 text-sm leading-relaxed">The Analyzer agent securely digests thick PDFs and messy notes into structured knowledge bases instantly.</p>
          </div>

          <div className="glass rounded-3xl p-6 border border-white/10 hover:bg-white/5 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
               <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-2">Adaptive Quizzes</h3>
            <p className="text-slate-400 text-sm leading-relaxed">QuestionGen constructs layered testing protocols based directly on your documents, adjusting to your mastery level.</p>
          </div>

          <div className="glass rounded-3xl p-6 border border-white/10 hover:bg-white/5 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4">
               <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-2">Deep Concept Flow</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Stuck? The Explainer agent breaks down high-surface area mechanics into accessible metaphors mid-quiz.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
