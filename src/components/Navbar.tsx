import React from 'react';
import { SubjectId } from '../types';
import { CURRICULUM_DATA } from '../data/curriculum';
import {
  Sparkles,
  Flame,
  Award,
  BookOpen,
  Code2,
  Brain,
  AlertTriangle,
  Play
} from 'lucide-react';

interface NavbarProps {
  activeSubjectId: SubjectId;
  onSelectSubject: (id: SubjectId) => void;
  activeTab: 'dashboard' | 'lesson' | 'playground' | 'tutor' | 'weak-topics';
  onChangeTab: (tab: 'dashboard' | 'lesson' | 'playground' | 'tutor' | 'weak-topics') => void;
  xp: number;
  streak: number;
  weakCount: number;
  onOpenAiTutor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSubjectId,
  onSelectSubject,
  activeTab,
  onChangeTab,
  xp,
  streak,
  weakCount,
  onOpenAiTutor,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#090d16]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onChangeTab('dashboard')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[1.5px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <span className="text-xl font-black bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent">
                    V
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-cyan-300 transition">
                    Visora
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/40">
                    AI Visual
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  See code & math come alive
                </p>
              </div>
            </button>

            {/* Subject Selector Buttons */}
            <div className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              {CURRICULUM_DATA.map((subject) => {
                const isSelected = activeSubjectId === subject.id;
                return (
                  <button
                    key={subject.id}
                    onClick={() => {
                      onSelectSubject(subject.id);
                      if (activeTab === 'dashboard') {
                        onChangeTab('lesson');
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-slate-800 text-white shadow-sm shadow-black/40 border border-slate-700'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <span className="text-sm">{subject.icon}</span>
                    <span>{subject.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="flex items-center gap-1">
              <button
                onClick={() => onChangeTab('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === 'dashboard'
                    ? 'text-cyan-400 bg-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                Dashboard
              </button>

              <button
                onClick={() => onChangeTab('lesson')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === 'lesson'
                    ? 'text-cyan-400 bg-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Visualizer</span>
              </button>

              <button
                onClick={() => onChangeTab('playground')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === 'playground'
                    ? 'text-indigo-400 bg-indigo-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Playground</span>
              </button>

              <button
                onClick={() => onChangeTab('weak-topics')}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === 'weak-topics'
                    ? 'text-amber-400 bg-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Weak Topics</span>
                {weakCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                    {weakCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Streak & XP Stats */}
            <div className="hidden lg:flex items-center gap-3 pl-2 border-l border-slate-800">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
                <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400 animate-pulse" />
                <span>{streak}d Streak</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold">
                <Award className="w-3.5 h-3.5 text-violet-400" />
                <span>{xp} XP</span>
              </div>
            </div>

            {/* AI Tutor Action Button */}
            <button
              onClick={onOpenAiTutor}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all transform active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              <span>AI Visual Tutor</span>
            </button>
          </div>
        </div>

        {/* Mobile Subject Bar */}
        <div className="flex md:hidden items-center gap-1 pb-2.5 overflow-x-auto no-scrollbar">
          {CURRICULUM_DATA.map((subject) => {
            const isSelected = activeSubjectId === subject.id;
            return (
              <button
                key={subject.id}
                onClick={() => {
                  onSelectSubject(subject.id);
                  if (activeTab === 'dashboard') onChangeTab('lesson');
                }}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                    : 'text-slate-400 bg-slate-900/60'
                }`}
              >
                <span>{subject.icon}</span>
                <span>{subject.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
