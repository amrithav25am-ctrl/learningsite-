import React, { useState } from 'react';
import { UserStats, Topic, SubjectId, QuizQuestion } from '../types';
import { CURRICULUM_DATA } from '../data/curriculum';
import {
  AlertTriangle,
  Sparkles,
  Play,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  TrendingDown,
  Loader2
} from 'lucide-react';

interface WeakTopicsViewProps {
  userStats: UserStats;
  onSelectTopic: (topic: Topic) => void;
  onOpenAiTutor: (topicTitle?: string) => void;
  onOpenQuizForTopic: (topic: Topic) => void;
  onResolveWeakTopic: (topicId: string, subjectId: SubjectId) => void;
}

export const WeakTopicsView: React.FC<WeakTopicsViewProps> = ({
  userStats,
  onSelectTopic,
  onOpenAiTutor,
  onOpenQuizForTopic,
  onResolveWeakTopic,
}) => {
  const allTopics = CURRICULUM_DATA.flatMap((s) => s.topics);
  const [isGeneratingAiQuiz, setIsGeneratingAiQuiz] = useState(false);
  const [generatedAiQuiz, setGeneratedAiQuiz] = useState<QuizQuestion[] | null>(null);

  // Filter weak topics
  const weakTopics = allTopics.filter((t) => {
    const prog = userStats.topicProgress[t.id];
    return prog && (prog.weak || (prog.quizScore !== undefined && prog.quizScore < 70));
  });

  // Other topics needing practice (not completed)
  const uncompletedTopics = allTopics.filter(
    (t) => !userStats.completedTopicIds.includes(t.id) && !weakTopics.some((w) => w.id === t.id)
  );

  const handleGenerateAiDiagnosticQuiz = async () => {
    setIsGeneratingAiQuiz(true);
    try {
      const weakTitles = weakTopics.map((t) => t.title);
      const res = await fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: 'Engineering & Programming',
          weakTopics: weakTitles,
          count: 3,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate diagnostic quiz');
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setGeneratedAiQuiz(data.questions);
      }
    } catch (e) {
      console.warn('AI Quiz generation fallback:', e);
      // Fallback questions for weak topics
      if (weakTopics.length > 0 && weakTopics[0].quiz.length > 0) {
        onOpenQuizForTopic(weakTopics[0]);
      }
    } finally {
      setIsGeneratingAiQuiz(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Targeted Weak Topic Radar
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Weak Concepts & Diagnostic Review
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Visora continuously analyzes your quiz attempts and marks topics that require reinforced visual intuition.
          </p>
        </div>

        {weakTopics.length > 0 && (
          <button
            onClick={handleGenerateAiDiagnosticQuiz}
            disabled={isGeneratingAiQuiz}
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition"
          >
            {isGeneratingAiQuiz ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>AI Diagnostic Quiz</span>
          </button>
        )}
      </div>

      {/* Weak Topics List */}
      {weakTopics.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Immediate Attention Required ({weakTopics.length}):
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {weakTopics.map((topic) => {
              const prog = userStats.topicProgress[topic.id];
              const subject = CURRICULUM_DATA.find((s) => s.id === topic.subjectId);

              return (
                <div
                  key={topic.id}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-amber-800/40 hover:border-amber-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{subject?.icon}</span>
                      <span className="text-xs font-bold text-slate-400">
                        {subject?.name}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/40">
                        Quiz Score: {prog?.quizScore ?? 0}%
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-slate-300">
                      {topic.tagline}
                    </p>

                    <div className="pt-1 text-[11px] text-amber-300/90 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Takeaway: {topic.keyVisualTakeaway}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      onClick={() => onSelectTopic(topic)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Watch Visualizer</span>
                    </button>

                    <button
                      onClick={() => onOpenQuizForTopic(topic)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Retake Quiz</span>
                    </button>

                    <button
                      onClick={() => onResolveWeakTopic(topic.id, topic.subjectId)}
                      className="p-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-800/40 transition"
                      title="Mark as Resolved"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 text-center flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">
            No Weak Topics Detected!
          </h3>
          <p className="text-xs text-slate-400 max-w-md">
            All quizzes you have attempted meet mastery thresholds. Keep practicing to retain your mental models!
          </p>
        </div>
      )}

      {/* Suggested Next Modules */}
      {uncompletedTopics.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Upcoming Recommended Modules ({uncompletedTopics.length}):
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {uncompletedTopics.map((topic) => {
              const subject = CURRICULUM_DATA.find((s) => s.id === topic.subjectId);
              return (
                <div
                  key={topic.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <span>{subject?.icon}</span>
                      <span>{subject?.name}</span>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white">
                      {topic.title}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectTopic(topic)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-400 transition"
                  >
                    Start
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
