import React, { useState, useEffect, useRef } from 'react';
import { Topic, ExecutionFrame, SubjectId } from '../types';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Terminal,
  Layers,
  ArrowRight,
  Database,
  Cpu,
  CheckCircle2,
  Code2,
  Wand2,
  Loader2,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface CodeVisualizerProps {
  topic: Topic;
  subjectId: SubjectId;
  onOpenQuiz: () => void;
  onAskAiAboutTopic: (question?: string, codeSnippet?: string) => void;
  onTopicComplete?: () => void;
}

export const CodeVisualizer: React.FC<CodeVisualizerProps> = ({
  topic,
  subjectId,
  onOpenQuiz,
  onAskAiAboutTopic,
  onTopicComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [customCodeModalOpen, setCustomCodeModalOpen] = useState(false);
  const [customCodeInput, setCustomCodeInput] = useState('');
  const [isSimulatingCustom, setIsSimulatingCustom] = useState(false);
  const [customFrames, setCustomFrames] = useState<ExecutionFrame[] | null>(null);
  const [simulationError, setSimulationError] = useState<string | null>(null);

  // Active frames (custom or pre-built)
  const frames = customFrames || topic.frames || [];
  const currentFrame: ExecutionFrame | undefined = frames[currentStepIndex];

  // Auto-play timer
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < frames.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            if (onTopicComplete) onTopicComplete();
            return prev;
          }
        });
      }, 2000 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, frames.length, playbackSpeed, onTopicComplete]);

  // Reset when topic changes
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setCustomFrames(null);
    setSimulationError(null);
  }, [topic.id]);

  const handleNext = () => {
    if (currentStepIndex < frames.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      if (currentStepIndex + 1 === frames.length - 1 && onTopicComplete) {
        onTopicComplete();
      }
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  // Custom code simulation via server Gemini
  const handleSimulateCustomCode = async () => {
    if (!customCodeInput.trim()) return;
    setIsSimulatingCustom(true);
    setSimulationError(null);

    try {
      const res = await fetch('/api/ai/visualize-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: customCodeInput,
          language: topic.language || 'c',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to simulate trace');
      }

      const data = await res.json();
      if (data.frames && data.frames.length > 0) {
        // Convert to ExecutionFrame format
        const parsed: ExecutionFrame[] = data.frames.map((f: any, idx: number) => ({
          step: idx + 1,
          line: f.line || 1,
          code: customCodeInput.split('\n')[f.line - 1] || f.action,
          action: f.action || 'Executing step',
          explanation: f.action || '',
          variables: f.variables || [],
          stack: f.memory?.stack || [
            {
              frameName: 'main()',
              slots: (f.variables || []).map((v: any, vIdx: number) => ({
                name: v.name,
                address: `0x7ffd${vIdx * 8}`,
                value: String(v.value),
                type: v.type,
              })),
            },
          ],
          heap: f.memory?.heap || [],
          stdout: f.stdout || '',
          visualTip: f.visualTip || '',
        }));

        setCustomFrames(parsed);
        setCurrentStepIndex(0);
        setCustomCodeModalOpen(false);
      } else {
        throw new Error('Simulation did not return step frames.');
      }
    } catch (err: any) {
      console.error(err);
      setSimulationError(err.message || 'Error executing AI simulation');
    } finally {
      setIsSimulatingCustom(false);
    }
  };

  const rawCode = customFrames
    ? customCodeInput
    : topic.initialCode || '// No code available';
  const codeLines = rawCode.split('\n');

  return (
    <div className="flex flex-col gap-5">
      {/* Visualizer Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Interactive Execution Simulator
            </span>
            <span className="text-xs text-slate-400">
              {topic.language?.toUpperCase() || subjectId.toUpperCase()}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>{topic.title}</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-0.5">
            {topic.tagline}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCustomCodeInput(topic.initialCode || '');
              setCustomCodeModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            title="Type or paste your own code to simulate"
          >
            <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Code Simulator</span>
          </button>

          <button
            onClick={() => onAskAiAboutTopic(undefined, topic.initialCode)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Explain Visually</span>
          </button>

          <button
            onClick={onOpenQuiz}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Test Visual Quiz</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Code on Left, Live Memory / Architecture on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Code Inspector with active line highlight (5 cols) */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
          {/* Code Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/60">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-xs font-mono text-slate-400 ml-2">
                source.{topic.language === 'python' ? 'py' : topic.language === 'java' ? 'java' : 'c'}
              </span>
            </div>
            {currentFrame && (
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                Line {currentFrame.line} Active
              </span>
            )}
          </div>

          {/* Code Listing */}
          <div className="p-4 font-mono text-xs sm:text-sm overflow-x-auto bg-[#070b13] max-h-[440px] select-text">
            {codeLines.map((lineText, idx) => {
              const lineNum = idx + 1;
              const isCurrentLine = currentFrame?.line === lineNum;
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 px-2 py-1 rounded transition-colors ${
                    isCurrentLine
                      ? 'bg-cyan-500/15 border-l-4 border-cyan-400 text-white font-medium shadow-inner'
                      : 'text-slate-300 hover:bg-slate-900/40'
                  }`}
                >
                  <span className="w-6 text-right text-slate-600 select-none text-xs">
                    {lineNum}
                  </span>
                  <div className="flex-1 whitespace-pre leading-relaxed">
                    {lineText}
                  </div>
                  {isCurrentLine && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-400 text-slate-950 select-none animate-pulse">
                      EXEC
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Note for Current Step */}
          {currentFrame && (
            <div className="p-3 border-t border-slate-800/80 bg-slate-900/40 flex items-start gap-2.5">
              <Cpu className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-cyan-300">Action: </span>
                <span className="text-slate-300">{currentFrame.action}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Visual Memory Architecture (Stack & Heap + Watch Table) (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Memory Visualizer Panel */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Physical RAM Architecture (Stack & Heap)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Step {currentStepIndex + 1} of {frames.length}
              </span>
            </div>

            {/* Split Stack & Heap Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stack Segment */}
              <div className="flex flex-col rounded-xl bg-slate-950/80 border border-slate-800 p-3.5">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    Call Stack (LIFO)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    High Memory (0x7fff...)
                  </span>
                </div>

                <div className="space-y-2.5 min-h-[140px]">
                  {currentFrame?.stack && currentFrame.stack.length > 0 ? (
                    currentFrame.stack.map((frame, fIdx) => (
                      <div
                        key={fIdx}
                        className="rounded-lg border border-sky-500/30 bg-sky-950/20 p-2.5"
                      >
                        <div className="text-[11px] font-bold text-sky-300 font-mono mb-1.5 flex items-center justify-between">
                          <span>Frame: {frame.frameName}</span>
                          <span className="text-[9px] text-sky-400/80 uppercase">
                            Stack Frame
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          {frame.slots.map((slot, sIdx) => {
                            const isAddressActive =
                              currentFrame.activeMemoryAddress === slot.address;
                            return (
                              <div
                                key={sIdx}
                                className={`flex items-center justify-between p-1.5 rounded font-mono text-xs transition-all ${
                                  isAddressActive
                                    ? 'bg-sky-500/30 border border-sky-400 text-white font-bold ring-2 ring-sky-500/20'
                                    : 'bg-slate-900/90 text-slate-300 border border-slate-800'
                                }`}
                              >
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] text-slate-500">
                                    {slot.address}
                                  </span>
                                  <span className="text-sky-300 font-semibold">
                                    {slot.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-emerald-400 font-bold">
                                    {slot.value}
                                  </span>
                                  {slot.pointsTo && (
                                    <span className="flex items-center text-[10px] text-amber-400 bg-amber-950/60 px-1 py-0.5 rounded border border-amber-800/50">
                                      <ArrowRight className="w-2.5 h-2.5 mr-0.5" />
                                      {slot.pointsTo}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-28 text-slate-600 text-xs font-mono">
                      Stack empty
                    </div>
                  )}
                </div>
              </div>

              {/* Heap Segment */}
              <div className="flex flex-col rounded-xl bg-slate-950/80 border border-slate-800 p-3.5">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" />
                    Dynamic Heap (malloc/new)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Low Memory (0x1000...)
                  </span>
                </div>

                <div className="space-y-2.5 min-h-[140px]">
                  {currentFrame?.heap && currentFrame.heap.length > 0 ? (
                    currentFrame.heap.map((hObj, hIdx) => {
                      const isAddressActive =
                        currentFrame.activeMemoryAddress === hObj.address;
                      return (
                        <div
                          key={hIdx}
                          className={`rounded-lg border p-2.5 transition-all ${
                            isAddressActive
                              ? 'border-amber-400 bg-amber-950/30 ring-2 ring-amber-500/20'
                              : 'border-amber-500/30 bg-amber-950/20'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] font-mono text-amber-300 mb-1">
                            <span className="font-bold">{hObj.label}</span>
                            <span className="text-slate-400">{hObj.address}</span>
                          </div>
                          <div className="p-1.5 rounded bg-slate-900/90 font-mono text-xs text-emerald-400 border border-slate-800">
                            {hObj.value}
                          </div>
                          {hObj.fields && (
                            <div className="mt-1.5 grid grid-cols-2 gap-1 text-[10px] font-mono">
                              {hObj.fields.map((f, fKey) => (
                                <div
                                  key={fKey}
                                  className="bg-slate-900 px-1.5 py-0.5 rounded text-slate-300"
                                >
                                  {f.key}: <span className="text-white">{f.value}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center h-28 text-slate-600 text-xs font-mono text-center p-3">
                      <span>No Heap allocation in this frame</span>
                      <span className="text-[10px] text-slate-700 mt-1">
                        (Variables reside on Stack)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pointer Link Indicator Banner */}
            {currentFrame?.variables.some((v) => v.pointsTo) && (
              <div className="mt-3 p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-amber-300">
                  <ArrowRight className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="font-semibold">Active Pointer Link:</span>
                  {currentFrame.variables
                    .filter((v) => v.pointsTo)
                    .map((v, i) => (
                      <span key={i} className="font-mono text-amber-200">
                        {v.name} ({v.address}) ──▶ {v.pointsTo}
                      </span>
                    ))}
                </div>
                <span className="text-[11px] text-amber-400/80 font-mono">
                  *dereference resolves target
                </span>
              </div>
            )}
          </div>

          {/* Variable Watch & Execution Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Variable Watch Table */}
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  Watch Variables
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Scope: local</span>
              </div>
              <div className="space-y-1.5 max-h-[110px] overflow-y-auto">
                {currentFrame?.variables.map((v, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-2.5 py-1 rounded text-xs font-mono transition-all ${
                      v.changed
                        ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 font-bold'
                        : 'bg-slate-950/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">{v.name}</span>
                      {v.type && (
                        <span className="text-[10px] text-slate-600">
                          [{v.type}]
                        </span>
                      )}
                    </div>
                    <span className="text-emerald-400 font-semibold">{v.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation / Visual Tip */}
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3.5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Step Mental Model
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentFrame?.explanation}
                </p>
              </div>
              {currentFrame?.visualTip && (
                <div className="mt-2 text-[11px] text-indigo-300 bg-indigo-950/40 p-1.5 rounded border border-indigo-800/40 font-medium">
                  💡 {currentFrame.visualTip}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Playback Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition focus:outline-none"
            title="Reset to Beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 transition focus:outline-none"
            title="Previous Step"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md shadow-cyan-600/30 transition focus:outline-none"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Play Simulation</span>
              </>
            )}
          </button>
          <button
            onClick={handleNext}
            disabled={currentStepIndex === frames.length - 1}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 transition focus:outline-none"
            title="Next Step"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Speed Toggle */}
          <div className="flex items-center ml-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {[0.5, 1, 2].map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-mono font-medium transition ${
                  playbackSpeed === speed
                    ? 'bg-slate-800 text-cyan-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Step Progress Bar & Indicators */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {frames.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  setIsPlaying(false);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? 'bg-cyan-400 ring-4 ring-cyan-500/20 scale-125'
                    : idx < currentStepIndex
                    ? 'bg-cyan-800'
                    : 'bg-slate-800'
                }`}
                title={`Jump to step ${idx + 1}`}
              />
            ))}
          </div>
          <span className="text-xs font-mono text-slate-400">
            Step {currentStepIndex + 1} / {frames.length}
          </span>
        </div>
      </div>

      {/* Key Takeaway Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/40 flex items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wide">
              Key Visual Takeaway
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
              {topic.keyVisualTakeaway}
            </p>
          </div>
        </div>
        <button
          onClick={onOpenQuiz}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium border border-slate-700 transition"
        >
          <span>Take Quiz</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Custom Code AI Simulation Modal */}
      {customCodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  AI Code Execution Simulator
                </h3>
              </div>
              <button
                onClick={() => setCustomCodeModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Type or paste any snippet of {topic.language?.toUpperCase() || 'C / Python / Java'}. Visora's Gemini engine will compile execution traces with stack/heap frames and pointers.
            </p>

            <textarea
              value={customCodeInput}
              onChange={(e) => setCustomCodeInput(e.target.value)}
              rows={8}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              placeholder={`// Paste your ${topic.language} code here...`}
            />

            {simulationError && (
              <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{simulationError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 mt-2">
              <button
                onClick={() => setCustomCodeModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSimulateCustomCode}
                disabled={isSimulatingCustom || !customCodeInput.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
              >
                {isSimulatingCustom ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing RAM states...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Generate Visual Trace</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
