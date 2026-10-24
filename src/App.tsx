import React, { useState, useEffect } from 'react';
import { SubjectId, Topic, UserStats } from './types';
import { CURRICULUM_DATA } from './data/curriculum';
import {
  loadUserStats,
  recordQuizCompletion,
  markTopicCompleted,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { CodeVisualizer } from './components/CodeVisualizer';
import { MathVisualizer } from './components/MathVisualizer';
import { VisualQuiz } from './components/VisualQuiz';
import { AiTutor } from './components/AiTutor';
import { WeakTopicsView } from './components/WeakTopicsView';
import { Playground } from './components/Playground';
import {
  BookOpen,
  ChevronRight,
  Code2,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Flame,
  Award
} from 'lucide-react';

export default function App() {
  const [userStats, setUserStats] = useState<UserStats>(loadUserStats());
  const [activeSubjectId, setActiveSubjectId] = useState<SubjectId>('c');

  // Currently selected topic
  const initialSubject =
    CURRICULUM_DATA.find((s) => s.id === activeSubjectId) || CURRICULUM_DATA[0];
  const [activeTopic, setActiveTopic] = useState<Topic>(
    initialSubject.topics[0]
  );

  // Active top-level view tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'lesson' | 'playground' | 'tutor' | 'weak-topics'
  >('dashboard');

  // AI Tutor Modal State
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);
  const [aiTutorPrompt, setAiTutorPrompt] = useState<string | undefined>(
    undefined
  );
  const [aiTutorCodeSnippet, setAiTutorCodeSnippet] = useState<
    string | undefined
  >(undefined);

  // Quiz Modal State
  const [activeQuizTopic, setActiveQuizTopic] = useState<Topic | null>(null);

  // Synchronize active topic when subject changes
  const handleSelectSubject = (id: SubjectId) => {
    setActiveSubjectId(id);
    const sub = CURRICULUM_DATA.find((s) => s.id === id);
    if (sub && sub.topics.length > 0) {
      setActiveTopic(sub.topics[0]);
    }
  };

  const handleSelectTopic = (topic: Topic) => {
    setActiveSubjectId(topic.subjectId);
    setActiveTopic(topic);
    setActiveTab('lesson');
  };

  const handleOpenAiTutor = (question?: string, codeSnippet?: string) => {
    setAiTutorPrompt(question);
    setAiTutorCodeSnippet(codeSnippet);
    setIsAiTutorOpen(true);
  };

  const handleOpenQuiz = (topic?: Topic) => {
    setActiveQuizTopic(topic || activeTopic);
  };

  const handleQuizComplete = (scorePercentage: number) => {
    if (!activeQuizTopic) return;
    const updated = recordQuizCompletion(
      activeQuizTopic.id,
      activeQuizTopic.subjectId,
      scorePercentage
    );
    setUserStats(updated);
  };

  const handleTopicComplete = (topicId?: string, subjectId?: SubjectId) => {
    const tId = topicId || activeTopic.id;
    const sId = subjectId || activeTopic.subjectId;
    const updated = markTopicCompleted(tId, sId);
    setUserStats(updated);
  };

  const handleResolveWeakTopic = (topicId: string, subjectId: SubjectId) => {
    const updated = recordQuizCompletion(topicId, subjectId, 100);
    setUserStats(updated);
  };

  // Count weak topics
  const allTopics = CURRICULUM_DATA.flatMap((s) => s.topics);
  const weakCount = allTopics.filter((t) => {
    const p = userStats.topicProgress[t.id];
    return p && (p.weak || (p.quizScore !== undefined && p.quizScore < 70));
  }).length;

  const currentSubject =
    CURRICULUM_DATA.find((s) => s.id === activeSubjectId) || CURRICULUM_DATA[0];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation */}
      <Navbar
        activeSubjectId={activeSubjectId}
        onSelectSubject={handleSelectSubject}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        xp={userStats.xp}
        streak={userStats.streakDays}
        weakCount={weakCount}
        onOpenAiTutor={() => handleOpenAiTutor()}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <Dashboard
            userStats={userStats}
            onSelectTopic={handleSelectTopic}
            onSelectSubject={handleSelectSubject}
            onOpenAiTutor={handleOpenAiTutor}
            onOpenWeakTopics={() => setActiveTab('weak-topics')}
          />
        )}

        {/* TAB 2: INTERACTIVE VISUALIZER LESSON */}
        {activeTab === 'lesson' && (
          <div className="space-y-6">
            {/* Subject Topic Sub-Navigation Bar */}
            <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentSubject.icon}</span>
                <span className="text-xs font-bold text-white uppercase tracking-wider hidden sm:inline">
                  {currentSubject.name}:
                </span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {currentSubject.topics.map((t) => {
                  const isCurrent = t.id === activeTopic.id;
                  const isDone = userStats.completedTopicIds.includes(t.id);
                  const isWeak = userStats.topicProgress[t.id]?.weak;

                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTopic(t)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                        isCurrent
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <span>{t.title}</span>
                      {isWeak && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      )}
                      {isDone && !isWeak && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Visualizer Engine (Code or Math) */}
            {activeTopic.subjectId === 'math' ? (
              <MathVisualizer
                topic={activeTopic}
                onOpenQuiz={() => handleOpenQuiz(activeTopic)}
                onAskAiAboutTopic={(q) => handleOpenAiTutor(q, activeTopic.title)}
                onTopicComplete={() => handleTopicComplete(activeTopic.id, 'math')}
              />
            ) : (
              <CodeVisualizer
                topic={activeTopic}
                subjectId={activeSubjectId}
                onOpenQuiz={() => handleOpenQuiz(activeTopic)}
                onAskAiAboutTopic={(q, code) =>
                  handleOpenAiTutor(q || activeTopic.title, code)
                }
                onTopicComplete={() =>
                  handleTopicComplete(activeTopic.id, activeTopic.subjectId)
                }
              />
            )}
          </div>
        )}

        {/* TAB 3: PLAYGROUND SANDBOX */}
        {activeTab === 'playground' && (
          <Playground
            onOpenAiTutor={handleOpenAiTutor}
            onOpenQuiz={handleOpenQuiz}
            onTopicComplete={handleTopicComplete}
          />
        )}

        {/* TAB 4: WEAK TOPICS REVIEW */}
        {activeTab === 'weak-topics' && (
          <WeakTopicsView
            userStats={userStats}
            onSelectTopic={handleSelectTopic}
            onOpenAiTutor={handleOpenAiTutor}
            onOpenQuizForTopic={handleOpenQuiz}
            onResolveWeakTopic={handleResolveWeakTopic}
          />
        )}
      </main>

      {/* AI Tutor Modal */}
      {isAiTutorOpen && (
        <AiTutor
          subjectId={activeSubjectId}
          initialTopicTitle={activeTopic.title}
          initialQuestion={aiTutorPrompt}
          initialCode={aiTutorCodeSnippet}
          onClose={() => setIsAiTutorOpen(false)}
        />
      )}

      {/* Visual Quiz Modal */}
      {activeQuizTopic && (
        <VisualQuiz
          questions={activeQuizTopic.quiz}
          topicTitle={activeQuizTopic.title}
          topicId={activeQuizTopic.id}
          subjectId={activeQuizTopic.subjectId}
          onComplete={handleQuizComplete}
          onClose={() => setActiveQuizTopic(null)}
          onAskAiDoubt={(doubt) => {
            setActiveQuizTopic(null);
            handleOpenAiTutor(doubt);
          }}
        />
      )}
    </div>
  );
}
