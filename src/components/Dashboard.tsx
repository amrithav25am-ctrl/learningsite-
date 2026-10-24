import React from 'react';
import { SubjectId, Topic, UserStats } from '../types';
import { CURRICULUM_DATA } from '../data/curriculum';
import {
  Sparkles,
  Flame,
  Award,
  AlertTriangle,
  Play,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Brain,
  Code2,
  BookOpen,
  ArrowRight,
  Layers
} from 'lucide-react';

interface DashboardProps {
  userStats: UserStats;
  onSelectTopic: (topic: Topic) => void;
  onSelectSubject: (subjectId: SubjectId) => void;
  onOpenAiTutor: (topicTitle?: string) => void;
  onOpenWeakTopics: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userStats,
  onSelectTopic,
  onSelectSubject,
  onOpenAiTutor,
  onOpenWeakTopics,
}) => {
  // Aggregate stats
  const allTopics: Topic[] = CURRICULUM_DATA.flatMap((s) => s.topics);
  const totalTopicsCount = allTopics.length;
  const completedCount = userStats.completedTopicIds.length;
  const completionPercentage = Math.round((completedCount / totalTopicsCount) * 100);

  // Weak topics list
  const weakTopics = allTopics.filter((t) => {
    const prog = userStats.topicProgress[t.id];
    return prog && prog.weak;
  });

  // Recent / Last active topic
  const lastTopic =
    allTopics.find((t) => t.id === userStats.lastActiveTopicId) || allTopics[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner with Stats Overview */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30">
                Visual Intuition Platform
              </span>
              <span className="text-xs text-slate-400">
                Stop reading dry walls of text. See it happen.
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Master Code & Math Through{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Live Interactive Simulations
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Understand memory allocation in C, recursion trees in Python, JVM stack vs heap in Java, and geometric matrix distortions in engineering mathematics.
            </p>

            {/* Quick Continue Card */}
            {lastTopic && (
              <div className="mt-5 inline-flex items-center gap-3 p-2 pr-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition">
                <button
                  onClick={() => onSelectTopic(lastTopic)}
                  className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition"
                  title="Resume Lesson"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Resume Active Module
                  </span>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    {lastTopic.title}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                Mastery
              </span>
              <span className="text-2xl font-black text-white mt-1">
                {completionPercentage}%
              </span>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                Streak
              </span>
              <span className="text-2xl font-black text-orange-400 mt-1">
                {userStats.streakDays} Days
              </span>
              <span className="text-[10px] text-slate-500 mt-1">
                Daily visual drills
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col col-span-2 sm:col-span-1">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-violet-400" />
                Experience
              </span>
              <span className="text-2xl font-black text-violet-300 mt-1">
                {userStats.xp} XP
              </span>
              <span className="text-[10px] text-slate-500 mt-1">
                {completedCount} of {totalTopicsCount} modules
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Weak Topics Diagnostic Alert if any */}
      {weakTopics.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  Weak Topics Diagnostic ({weakTopics.length} Need Review)
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 uppercase">
                  Targeted Drill
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Visora detected quiz inaccuracies in:{' '}
                <span className="font-semibold text-amber-200">
                  {weakTopics.map((t) => t.title).join(', ')}
                </span>
                . Strengthen your visual intuition with targeted simulations.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenWeakTopics}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition"
          >
            <span>Practice Weak Topics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Subjects & Topics Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">
              Curriculum & Visual Simulators
            </h2>
            <p className="text-xs text-slate-400">
              Select a discipline to launch step-by-step visual models
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CURRICULUM_DATA.map((subject) => {
            const subjectTopics = subject.topics;
            const completedInSubject = subjectTopics.filter((t) =>
              userStats.completedTopicIds.includes(t.id)
            ).length;
            const pct = Math.round(
              (completedInSubject / subjectTopics.length) * 100
            );

            return (
              <div
                key={subject.id}
                className="flex flex-col rounded-3xl bg-slate-900/80 border border-slate-800 p-6 hover:border-slate-700 transition shadow-xl"
              >
                {/* Subject Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-2xl bg-slate-950 border border-slate-800">
                      {subject.icon}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <span>{subject.name}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${subject.badgeBg}`}>
                          {completedInSubject}/{subjectTopics.length} Done
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {subject.tagline}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSelectSubject(subject.id);
                      onSelectTopic(subjectTopics[0]);
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title={`Explore ${subject.name}`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: subject.color,
                    }}
                  />
                </div>

                {/* Topics List */}
                <div className="space-y-2 mt-auto">
                  {subjectTopics.map((topic) => {
                    const isCompleted = userStats.completedTopicIds.includes(
                      topic.id
                    );
                    const progress = userStats.topicProgress[topic.id];

                    return (
                      <div
                        key={topic.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-950 transition group"
                      >
                        <button
                          onClick={() => {
                            onSelectSubject(subject.id);
                            onSelectTopic(topic);
                          }}
                          className="flex items-center gap-2.5 text-left flex-1 mr-2"
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                              isCompleted
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition">
                              {topic.title}
                            </div>
                            <div className="text-[10px] text-slate-500 line-clamp-1">
                              {topic.tagline}
                            </div>
                          </div>
                        </button>

                        <div className="flex items-center gap-2">
                          {progress?.quizScore !== undefined && (
                            <span
                              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                progress.quizScore >= 70
                                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                                  : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                              }`}
                            >
                              {progress.quizScore}%
                            </span>
                          )}

                          <button
                            onClick={() => {
                              onSelectSubject(subject.id);
                              onSelectTopic(topic);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-600 hover:text-white text-[11px] font-semibold text-slate-300 transition"
                          >
                            Launch
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Tutor Callout Footer */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-800/40 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-[1.5px] shadow-lg shadow-indigo-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Stuck on a tricky concept?
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Ask the Visora AI Tutor to generate custom ASCII architecture diagrams and step-by-step visual models.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenAiTutor()}
          className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>Open AI Visual Tutor</span>
        </button>
      </div>
    </div>
  );
};
