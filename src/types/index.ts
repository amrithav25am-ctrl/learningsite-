export type SubjectId = 'python' | 'c' | 'java' | 'math';

export interface VariableState {
  name: string;
  value: string;
  type?: string;
  address?: string;
  pointsTo?: string; // Target memory address or variable
  changed?: boolean;
}

export interface MemorySlot {
  name: string;
  address: string;
  value: string;
  type?: string;
  pointsTo?: string;
}

export interface StackFrame {
  frameName: string;
  slots: MemorySlot[];
}

export interface HeapObject {
  address: string;
  label: string;
  value: string;
  type?: string;
  fields?: { key: string; value: string }[];
}

export interface ExecutionFrame {
  step: number;
  line: number;
  code: string;
  explanation: string;
  action: string;
  variables: VariableState[];
  stack: StackFrame[];
  heap: HeapObject[];
  stdout?: string;
  visualTip?: string;
  activeMemoryAddress?: string;
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  subjectId: SubjectId;
  question: string;
  codeSnippet?: string;
  diagram?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  visualDetail?: string;
}

export interface Topic {
  id: string;
  subjectId: SubjectId;
  title: string;
  tagline: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  visualType: 'code-execution' | 'matrix-transform' | 'calculus' | 'fourier' | 'data-structure';
  conceptOverview: string;
  initialCode?: string;
  language?: string;
  frames?: ExecutionFrame[];
  mathConfig?: {
    type: 'matrix' | 'derivative' | 'integral' | 'fourier';
    defaultMatrix?: [[number, number], [number, number]];
    formula?: string;
  };
  quiz: QuizQuestion[];
  keyVisualTakeaway: string;
}

export interface Subject {
  id: SubjectId;
  name: string;
  icon: string;
  tagline: string;
  color: string;
  badgeBg: string;
  borderColor: string;
  description: string;
  topics: Topic[];
}

export interface TopicProgress {
  topicId: string;
  subjectId: SubjectId;
  completed: boolean;
  quizScore?: number; // 0 - 100
  lastPracticed?: string;
  attempts: number;
  weak: boolean;
}

export interface UserStats {
  xp: number;
  streakDays: number;
  completedTopicIds: string[];
  topicProgress: Record<string, TopicProgress>;
  lastActiveTopicId?: string;
}
