import React, { useState } from 'react';
import { SubjectId, Topic } from '../types';
import { CURRICULUM_DATA } from '../data/curriculum';
import { CodeVisualizer } from './CodeVisualizer';
import { MathVisualizer } from './MathVisualizer';
import {
  Code2,
  Grid,
  Activity,
  Waves,
  Sliders,
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';

interface PlaygroundProps {
  onOpenAiTutor: (topicTitle?: string) => void;
  onOpenQuiz: (topic: Topic) => void;
  onTopicComplete: (topicId: string, subjectId: SubjectId) => void;
}

export const Playground: React.FC<PlaygroundProps> = ({
  onOpenAiTutor,
  onOpenQuiz,
  onTopicComplete,
}) => {
  const [activeEngine, setActiveEngine] = useState<
    'c-pointers' | 'py-recursion' | 'matrix' | 'calculus' | 'fourier'
  >('matrix');

  // Find topics corresponding to engines
  const cPointerTopic = CURRICULUM_DATA.find((s) => s.id === 'c')?.topics[0]!;
  const pyRecursionTopic = CURRICULUM_DATA.find((s) => s.id === 'python')?.topics[0]!;
  const matrixTopic = CURRICULUM_DATA.find((s) => s.id === 'math')?.topics.find(
    (t) => t.id === 'math-matrix-transform'
  )!;
  const calculusTopic = CURRICULUM_DATA.find((s) => s.id === 'math')?.topics.find(
    (t) => t.id === 'math-calculus-derivative'
  )!;
  const fourierTopic = CURRICULUM_DATA.find((s) => s.id === 'math')?.topics.find(
    (t) => t.id === 'math-fourier'
  )!;

  return (
    <div className="space-y-6 pb-12">
      {/* Playground Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" />
              Interactive Visual Sandbox
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Visual Simulation Playground
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Experiment with memory architectures, coordinate morphing, and waveforms in real time.
          </p>
        </div>

        {/* Engine Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto no-scrollbar">
          {[
            { id: 'matrix', label: 'Matrix Grid', icon: '📐' },
            { id: 'c-pointers', label: 'C Memory & Pointers', icon: '⚙️' },
            { id: 'py-recursion', label: 'Recursion Call Tree', icon: '🐍' },
            { id: 'calculus', label: 'Derivative Limit', icon: '📈' },
            { id: 'fourier', label: 'Fourier Waves', icon: '🌊' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveEngine(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeEngine === tab.id
                  ? 'bg-slate-800 text-cyan-300 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Render Active Engine */}
      <div className="rounded-3xl">
        {activeEngine === 'matrix' && (
          <MathVisualizer
            topic={matrixTopic}
            onOpenQuiz={() => onOpenQuiz(matrixTopic)}
            onAskAiAboutTopic={(q) => onOpenAiTutor(q || matrixTopic.title)}
            onTopicComplete={() => onTopicComplete(matrixTopic.id, 'math')}
          />
        )}

        {activeEngine === 'c-pointers' && (
          <CodeVisualizer
            topic={cPointerTopic}
            subjectId="c"
            onOpenQuiz={() => onOpenQuiz(cPointerTopic)}
            onAskAiAboutTopic={(q, code) => onOpenAiTutor(q || cPointerTopic.title)}
            onTopicComplete={() => onTopicComplete(cPointerTopic.id, 'c')}
          />
        )}

        {activeEngine === 'py-recursion' && (
          <CodeVisualizer
            topic={pyRecursionTopic}
            subjectId="python"
            onOpenQuiz={() => onOpenQuiz(pyRecursionTopic)}
            onAskAiAboutTopic={(q, code) => onOpenAiTutor(q || pyRecursionTopic.title)}
            onTopicComplete={() => onTopicComplete(pyRecursionTopic.id, 'python')}
          />
        )}

        {activeEngine === 'calculus' && (
          <MathVisualizer
            topic={calculusTopic}
            onOpenQuiz={() => onOpenQuiz(calculusTopic)}
            onAskAiAboutTopic={(q) => onOpenAiTutor(q || calculusTopic.title)}
            onTopicComplete={() => onTopicComplete(calculusTopic.id, 'math')}
          />
        )}

        {activeEngine === 'fourier' && (
          <MathVisualizer
            topic={fourierTopic}
            onOpenQuiz={() => onOpenQuiz(fourierTopic)}
            onAskAiAboutTopic={(q) => onOpenAiTutor(q || fourierTopic.title)}
            onTopicComplete={() => onTopicComplete(fourierTopic.id, 'math')}
          />
        )}
      </div>
    </div>
  );
};
