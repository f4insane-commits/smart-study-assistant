"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowRight, CheckCircle2, XCircle, Brain, Sparkles } from "lucide-react";
import AgentLogPanel from "@/components/AgentLog";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export default function QuizInterface() {
  const params = useParams(); const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null); const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false); const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false); const [logs, setLogs] = useState<any[]>([]);
  const [explaining, setExplaining] = useState(false); const [explanation, setExplanation] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/quiz?quizId=${params.id}`).then(res => res.json()).then(data => {
        if (data.quiz) setQuiz({ ...data.quiz, questionsArray: JSON.parse(data.quiz.questions) });
        setLoading(false);
    });
  }, [params.id]);

  const handleSelect = (idx: number) => {
    if (isAnswered) return; setSelectedOption(idx); setIsAnswered(true);
    if (idx === quiz.questionsArray[currentIndex].correctAnswerIndex) setScore(s => s + 1);
  };

  const handleNext = async () => {
    if (currentIndex < quiz.questionsArray.length - 1) {
      setCurrentIndex(i => i + 1); setSelectedOption(null); setIsAnswered(false); setExplanation(null);
    } else {
      setLoading(true);
      const finalScore = selectedOption === quiz.questionsArray[currentIndex].correctAnswerIndex ? score + 1 : score;
      const res = await fetch("/api/quiz", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: "demo_user", quizId: quiz.id, topic: quiz.topic, score: finalScore, total: quiz.questionsArray.length }) });
      const data = await res.json(); if (data.logs) setLogs(data.logs);
      setLoading(false); setCompleted(true);
    }
  };

  const requestDeepExplanation = async () => {
    setExplaining(true); setLogs([]);
    const q = quiz.questionsArray[currentIndex];
    const res = await fetch("/api/explain", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ docId: quiz.documentId, concept: q.question }) });
    const data = await res.json(); if (data.logs) setLogs(data.logs);
    if (data.explanation) setExplanation(data.explanation); setExplaining(false);
  };

  if (loading && !quiz) return <div className="flex h-full items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-indigo-500" /></div>;
  if (!quiz) return <div>Quiz not found.</div>;
  const currentQ = quiz.questionsArray[currentIndex];

  return (
    <div className="flex h-full overflow-hidden p-6 gap-6 w-full">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-heading font-medium text-slate-300 flex items-center gap-2"><Brain className="w-5 h-5 text-indigo-400" /> {quiz.topic}</h2>
          <div className="px-4 py-1.5 rounded-full glass border border-white/10 text-sm font-semibold tracking-wide text-slate-400">
            {completed ? "Completed" : `Question ${currentIndex + 1} of ${quiz.questionsArray.length}`}
          </div>
        </div>

        {completed ? (
          <div className="flex-1 flex flex-col items-center justify-center glass rounded-3xl border border-white/10 p-12 text-center animate-in zoom-in-95">
             <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-6 shadow-2xl">
               <Sparkles className="w-12 h-12 text-white" />
             </div>
             <h2 className="text-4xl font-heading font-bold text-white mb-2">Quiz Complete</h2>
             <p className="text-xl text-slate-400 mb-8">You scored {score} out of {quiz.questionsArray.length}.</p>
             <button onClick={() => router.push('/progress')} className="px-8 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-200 transition-colors shadow-lg">View Progression Dashboard</button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-6">
            <div className="glass border border-white/10 rounded-3xl p-8 relative overflow-hidden flex-shrink-0">
               <div className="absolute top-0 left-0 w-full h-1 bg-white/5"><div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${((currentIndex) / quiz.questionsArray.length) * 100}%` }} /></div>
               <span className="inline-block px-3 py-1 mb-4 rounded border border-white/10 bg-white/5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                 {currentQ.difficulty || "Standard"} Mode
               </span>
               <h3 className="text-2xl font-serif text-slate-100 leading-snug">{currentQ.question}</h3>
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto pr-2 pb-4">
              {currentQ.options.map((opt: string, idx: number) => {
                const isSelected = selectedOption === idx; const isCorrectAnswer = isAnswered && idx === currentQ.correctAnswerIndex; const isWrongSelection = isSelected && !isCorrectAnswer;
                return (
                  <button key={idx} onClick={() => handleSelect(idx)} disabled={isAnswered} className={cn("w-full p-5 rounded-2xl border text-left flex items-center gap-4 transition-all duration-300", !isAnswered && "border-white/10 glass hover:bg-white/5 text-slate-300", isCorrectAnswer && "bg-emerald-500/10 border-emerald-500/50 text-emerald-300", isWrongSelection && "bg-red-500/10 border-red-500/50 text-red-300", (isAnswered && !isSelected && !isCorrectAnswer) && "opacity-50 grayscale border-white/5 glass text-slate-500")}>
                    <div className={cn("w-8 h-8 rounded-full border flex flex-shrink-0 items-center justify-center font-medium", !isAnswered && "border-white/10 glass text-slate-400", isCorrectAnswer && "border-emerald-500 bg-emerald-500 text-white", isWrongSelection && "border-red-500 bg-red-500 text-white")}>
                       {isCorrectAnswer ? <CheckCircle2 className="w-5 h-5" /> : isWrongSelection ? <XCircle className="w-5 h-5" /> : String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-lg leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>
            {isAnswered && (
              <div className="glass border border-indigo-500/30 rounded-2xl p-6 shadow-xl animate-in slide-in-from-bottom-4 flex-shrink-0 mt-auto">
                 <h4 className="font-semibold text-indigo-400 mb-2">Automated Explanation</h4>
                 <p className="text-slate-300 mb-6">{currentQ.explanation}</p>
                 {explanation && (
                   <div className="mt-4 mb-6 p-6 rounded-xl glass border border-purple-500/20 text-slate-300 prose prose-invert prose-indigo">
                     <span className="block text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Deep Agent Explanation</span>
                     <div className="markdown-body"><ReactMarkdown>{explanation}</ReactMarkdown></div>
                   </div>
                 )}
                 <div className="flex justify-between items-center">
                   <button onClick={requestDeepExplanation} disabled={explaining || !!explanation} className={cn("text-sm font-medium transition-colors border rounded-lg px-4 py-2", explaining || !!explanation ? "text-slate-500 border-white/10 glass" : "text-purple-400 border-purple-500/30 hover:bg-purple-500/10")}>
                     {explaining ? "Agent compiling deeper explanation..." : explanation ? "Concept Elaborated" : "I don't understand, explain concept deeper"}
                   </button>
                   <button onClick={handleNext} className="px-6 py-2.5 bg-white text-slate-900 hover:bg-slate-200 rounded-lg font-semibold flex items-center gap-2 transition-transform hover:scale-105">
                     {currentIndex < quiz.questionsArray.length - 1 ? "Next Question" : "Complete Module"} <ArrowRight className="w-5 h-5" />
                   </button>
                 </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="w-96 flex-shrink-0 hidden lg:block"><AgentLogPanel logs={logs} /></div>
    </div>
  );
}
