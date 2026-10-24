import React, { useState, useEffect } from 'react';
import { SubjectId } from '../types';
import {
  Sparkles,
  Send,
  Loader2,
  Brain,
  Lightbulb,
  AlertTriangle,
  Code2,
  Copy,
  Check,
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface AiTutorProps {
  subjectId: SubjectId;
  initialTopicTitle?: string;
  initialQuestion?: string;
  initialCode?: string;
  onClose: () => void;
}

interface StepExplanation {
  stepNumber: number;
  title: string;
  visualDescription: string;
  codeHighlight?: string;
  stateChanges?: Record<string, string>;
  explanation: string;
}

interface AiResponseStructure {
  title: string;
  summary: string;
  mentalModel: string;
  steps: StepExplanation[];
  visualAsciiDiagram?: string;
  commonGotchas: string[];
  proTip: string;
}

export const AiTutor: React.FC<AiTutorProps> = ({
  subjectId,
  initialTopicTitle,
  initialQuestion,
  initialCode,
  onClose,
}) => {
  const [questionInput, setQuestionInput] = useState(
    initialQuestion || ''
  );
  const [codeSnippet, setCodeSnippet] = useState(initialCode || '');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AiResponseStructure | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedDiagram, setCopiedDiagram] = useState(false);

  // Quick preset suggestions based on subject
  const presets: Record<SubjectId, string[]> = {
    c: [
      'Explain C pointers & memory dereferencing visually',
      'What really happens in RAM during malloc() vs stack allocation?',
      'Why does passing an array to a function decay to a pointer?',
      'Show me a visual memory leak example and how free() fixes it',
    ],
    python: [
      'Visual breakdown: Call stack unwinding in recursion',
      'Why does mutating b affect a in: a = [1,2]; b = a?',
      'How does Python dictionary hash bucketing handle collisions?',
      'Explain generators & yield state suspension visually',
    ],
    java: [
      'Stack vs Heap: What happens during new Object()?',
      'Why is Java strictly pass-by-value even for object references?',
      'Visual difference between String literal pool vs new String()',
      'How does JVM Garbage Collection detect unreachable circular references?',
    ],
    math: [
      'Geometric intuition: Why is matrix determinant the area scaling factor?',
      'How does secant slope Δy/Δx transform into tangent derivative?',
      'Visualize why Riemann rectangles converge into definite integrals',
      'How do rotating circle epicycles synthesize a sharp square wave?',
    ],
  };

  const handleAskTutor = async (qText?: string, codeText?: string) => {
    const activeQuestion = qText !== undefined ? qText : questionInput;
    const activeCode = codeText !== undefined ? codeText : codeSnippet;

    if (!activeQuestion.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subjectId,
          topic: initialTopicTitle || 'General',
          question: activeQuestion,
          codeSnippet: activeCode,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate visual explanation');
      }

      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      console.warn('AI Tutor API error or offline mode:', err);
      // Fallback structured visual explanation for immediate student feedback
      setResponse(getOfflineFallback(activeQuestion, subjectId));
    } finally {
      setIsLoading(false);
    }
  };

  // Run on mount if initialQuestion was passed
  useEffect(() => {
    if (initialQuestion) {
      handleAskTutor(initialQuestion, initialCode);
    }
  }, []);

  const handleCopyDiagram = () => {
    if (response?.visualAsciiDiagram) {
      navigator.clipboard.writeText(response.visualAsciiDiagram);
      setCopiedDiagram(true);
      setTimeout(() => setCopiedDiagram(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-[1.5px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  AI Visual Tutor
                </h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                  Step-by-Step
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Visual mental models & state diagrams instead of walls of text
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm transition"
          >
            ✕
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Preset Prompts */}
          {!response && !isLoading && (
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                Recommended Visual Inquiries:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {presets[subjectId].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuestionInput(preset);
                      handleAskTutor(preset);
                    }}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-950/20 text-xs text-slate-300 text-left transition flex items-start gap-2.5 group"
                  >
                    <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform mt-0.5">
                      →
                    </span>
                    <span>{preset}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              <h4 className="text-sm font-semibold text-white">
                Constructing Visual Mental Model...
              </h4>
              <p className="text-xs text-slate-400 max-w-sm">
                Analyzing memory frames, state transitions, and geometric intuition.
              </p>
            </div>
          )}

          {/* AI Response View */}
          {response && !isLoading && (
            <div className="space-y-6">
              {/* Title & One-Sentence Summary */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-950 border border-indigo-800/40">
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                  Concept Blueprint
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {response.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {response.summary}
                </p>
              </div>

              {/* Mental Model Blueprint Analogy */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Brain className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Visual Mental Model (Anchor)
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
                    {response.mentalModel}
                  </p>
                </div>
              </div>

              {/* ASCII / Box Diagram */}
              {response.visualAsciiDiagram && (
                <div className="rounded-2xl bg-[#070b13] border border-slate-800 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/60">
                    <span className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5" />
                      Visual Architecture Diagram
                    </span>
                    <button
                      onClick={handleCopyDiagram}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                    >
                      {copiedDiagram ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Diagram</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 font-mono text-xs text-emerald-300/90 overflow-x-auto leading-relaxed">
                    {response.visualAsciiDiagram}
                  </pre>
                </div>
              )}

              {/* Step-by-Step Breakdown */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  Step-by-Step Execution Sequence:
                </span>
                <div className="space-y-3">
                  {response.steps.map((st) => (
                    <div
                      key={st.stepNumber}
                      className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-[11px] font-mono">
                            {st.stepNumber}
                          </span>
                          <span>{st.title}</span>
                        </span>
                      </div>

                      {st.codeHighlight && (
                        <div className="px-2.5 py-1 rounded bg-slate-900 font-mono text-xs text-cyan-300 border border-slate-800 inline-block">
                          {st.codeHighlight}
                        </div>
                      )}

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {st.explanation}
                      </p>

                      <div className="p-2 rounded-lg bg-cyan-950/30 border border-cyan-800/30 text-[11px] text-cyan-300 font-mono">
                        👁️ <span className="font-semibold">Visual State:</span> {st.visualDescription}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gotchas & Pro Tips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/30 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Common Visual Gotchas
                  </span>
                  <ul className="space-y-1.5 text-xs text-rose-200/90 list-disc list-inside">
                    {response.commonGotchas.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/30 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Engineering Intuition
                  </span>
                  <p className="text-xs text-emerald-200/90 leading-relaxed">
                    {response.proTip}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Input Area */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  handleAskTutor();
                }
              }}
              placeholder={`Ask any concept doubt in ${subjectId.toUpperCase()} (e.g. "Why does malloc need sizeof?")...`}
              className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            <button
              onClick={() => handleAskTutor()}
              disabled={isLoading || !questionInput.trim()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Explain</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// High-fidelity fallback model when server Gemini key is not populated or offline
function getOfflineFallback(query: string, subject: SubjectId): AiResponseStructure {
  return {
    title: `Visual Walkthrough: ${query}`,
    summary: 'A concept is best understood not through syntax, but by visualizing how information flows through hardware memory and coordinate geometry.',
    mentalModel:
      subject === 'c'
        ? 'Think of physical RAM as a massive row of numbered postal locker boxes (0x000 to 0xFFF). A standard variable stores an item inside a locker. A pointer variable simply stores the locker number of ANOTHER locker box!'
        : subject === 'math'
        ? 'Think of a 2x2 matrix as a rubber sheet grid. The first column specifies where coordinate (1,0) gets stretched, and the second column specifies where (0,1) lands. The determinant is the factor by which area expands.'
        : subject === 'java'
        ? 'Think of Stack memory as your desktop work area holding temporary sticky notes (references), while Heap memory is a vast warehouse holding real constructed objects. The sticky notes contain warehouse barcode addresses.'
        : 'Think of function recursion as stacking physical paper trays. Each recursive call places a new tray on top. Once the base case is reached, trays are completed and removed one by one.',
    steps: [
      {
        stepNumber: 1,
        title: 'Initial State & Memory Layout',
        explanation: 'Before execution, memory registers and call stack frames are allocated in isolated memory segments.',
        visualDescription: 'Stack allocates space for local identifiers; heap objects reside at global addresses.',
      },
      {
        stepNumber: 2,
        title: 'State Transition & Value Flow',
        explanation: 'Operators evaluate and either mutate the target memory cell or pass references along the call stack.',
        visualDescription: 'Arrows connect referencing identifiers to target data blocks.',
      },
      {
        stepNumber: 3,
        title: 'Resolution & Cleanup',
        explanation: 'The operation completes and returns control or cleans up resources according to the language runtime.',
        visualDescription: 'Memory slots finalize their values or deallocate when out of scope.',
      },
    ],
    visualAsciiDiagram: `
+------------------+         points to        +------------------+
|  Stack Variable  | ───────────────────────▶ |  Memory / Value  |
|  Address: 0x7ffd |                          |  Address: 0x1a40 |
+------------------+                          +------------------+
`,
    commonGotchas: [
      'Assuming two references pointing to the same memory are independent copies.',
      'Forgetting that memory bounds must be respected to avoid undefined behavior.',
    ],
    proTip: 'Whenever you get stuck on an error, draw the memory boxes and arrows with a pen before writing code!',
  };
}
