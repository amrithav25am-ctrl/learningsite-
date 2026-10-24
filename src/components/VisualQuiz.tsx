import React, { useState } from 'react';
import { QuizQuestion, SubjectId } from '../types';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  Award,
  ChevronRight
} from 'lucide-react';

interface VisualQuizProps {
  questions: QuizQuestion[];
  topicTitle: string;
  topicId: string;
  subjectId: SubjectId;
  onComplete: (scorePercentage: number) => void;
  onClose: () => void;
  onAskAiDoubt: (questionText: string) => void;
}

export const VisualQuiz: React.FC<VisualQuizProps> = ({
  questions,
  topicTitle,
  topicId,
  subjectId,
  onComplete,
  onClose,
  onAskAiDoubt,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);

    if (selectedOption === currentQuestion.correctIndex) {
      setCorrectAnswersCount((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finished
      const finalCorrect =
        selectedOption === currentQuestion.correctIndex
          ? correctAnswersCount + 1
          : correctAnswersCount;
      const scorePct = Math.round((finalCorrect / questions.length) * 100);
      setIsQuizFinished(true);
      onComplete(scorePct);

      if (scorePct >= 70) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // ignore if canvas-confetti fails in headless
        }
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCorrectAnswersCount(0);
    setIsQuizFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              Visual Concept Check
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white mt-1">
              {topicTitle}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm transition"
          >
            ✕
          </button>
        </div>

        {/* Finished Screen */}
        {isQuizFinished ? (
          <div className="flex flex-col items-center text-center py-6 gap-4">
            {correctAnswersCount / questions.length >= 0.7 ? (
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Award className="w-8 h-8" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-8 h-8" />
              </div>
            )}

            <div>
              <h4 className="text-xl font-extrabold text-white">
                {correctAnswersCount / questions.length >= 0.7
                  ? 'Concept Mastered!'
                  : 'Needs Visual Review'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md">
                {correctAnswersCount / questions.length >= 0.7
                  ? `Great visual intuition! You scored ${Math.round(
                      (correctAnswersCount / questions.length) * 100
                    )}% and earned bonus XP.`
                  : `You scored ${Math.round(
                      (correctAnswersCount / questions.length) * 100
                    )}%. This topic has been added to your Weak Topics dashboard for targeted visual review.`}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 w-full max-w-xs flex justify-around font-mono text-sm">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">
                  Correct
                </span>
                <span className="text-emerald-400 font-bold text-lg">
                  {correctAnswersCount} / {questions.length}
                </span>
              </div>
              <div className="border-l border-slate-800 pl-4">
                <span className="text-[10px] text-slate-500 block uppercase">
                  Score
                </span>
                <span className="text-cyan-400 font-bold text-lg">
                  {Math.round((correctAnswersCount / questions.length) * 100)}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={handleRestart}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>

              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition"
              >
                <span>Continue Learning</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Active Question */
          <div className="flex flex-col gap-5">
            {/* Question Progress indicator */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                Question {currentIndex + 1} of {questions.length}
              </span>
              <div className="flex items-center gap-1">
                {questions.map((_, qIdx) => (
                  <span
                    key={qIdx}
                    className={`w-6 h-1 rounded-full ${
                      qIdx === currentIndex
                        ? 'bg-cyan-400'
                        : qIdx < currentIndex
                        ? 'bg-cyan-800'
                        : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Question Text */}
            <h4 className="text-sm sm:text-base font-semibold text-slate-100 leading-snug">
              {currentQuestion.question}
            </h4>

            {/* Code Snippet if present */}
            {currentQuestion.codeSnippet && (
              <pre className="p-3.5 rounded-xl bg-[#070b13] border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
                {currentQuestion.codeSnippet}
              </pre>
            )}

            {/* Options List */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctIndex;

                let optionStyle =
                  'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionStyle =
                      'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-semibold ring-1 ring-emerald-500/30';
                  } else if (isSelected && !isCorrect) {
                    optionStyle =
                      'bg-rose-950/40 border-rose-500 text-rose-200 ring-1 ring-rose-500/30';
                  } else {
                    optionStyle = 'opacity-40 border-slate-800 text-slate-500';
                  }
                } else if (isSelected) {
                  optionStyle =
                    'bg-cyan-500/10 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400/40';
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start justify-between gap-3 ${optionStyle}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-mono text-slate-400 shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Visual Explanation Revealed After Submit */}
            {isAnswerSubmitted && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Visual Explanation
                  </span>
                  <button
                    onClick={() => onAskAiDoubt(currentQuestion.question)}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Ask AI Tutor why →
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
                {currentQuestion.visualDetail && (
                  <div className="p-2 rounded-lg bg-indigo-950/30 border border-indigo-800/30 text-[11px] text-indigo-300 font-mono">
                    👁️ {currentQuestion.visualDetail}
                  </div>
                )}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {!isAnswerSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition"
                >
                  <span>
                    {currentIndex < questions.length - 1
                      ? 'Next Question'
                      : 'View Results'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
