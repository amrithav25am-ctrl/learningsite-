import React, { useState, useEffect, useRef } from 'react';
import { Topic, SubjectId } from '../types';
import {
  Sparkles,
  HelpCircle,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Grid,
  Activity,
  Waves,
  ChevronRight,
  Info
} from 'lucide-react';

interface MathVisualizerProps {
  topic: Topic;
  onOpenQuiz: () => void;
  onAskAiAboutTopic: (question?: string) => void;
  onTopicComplete?: () => void;
}

export const MathVisualizer: React.FC<MathVisualizerProps> = ({
  topic,
  onOpenQuiz,
  onAskAiAboutTopic,
  onTopicComplete,
}) => {
  // Mode determined by topic
  const visualType = topic.visualType;

  // ----------------------------------------------------
  // 1. Matrix Linear Transformation State
  // ----------------------------------------------------
  const [matrix, setMatrix] = useState<[[number, number], [number, number]]>([
    [1.5, 0.5],
    [0.5, 1.2],
  ]);
  const [transformT, setTransformT] = useState<number>(1); // 0 (Identity) to 1 (Fully Transformed)
  const [isMatrixPlaying, setIsMatrixPlaying] = useState<boolean>(false);
  const [testVector, setTestVector] = useState<[number, number]>([1, 1]);

  const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

  // Presets
  const setMatrixPreset = (presetName: string) => {
    switch (presetName) {
      case 'identity':
        setMatrix([[1, 0], [0, 1]]);
        break;
      case 'shear':
        setMatrix([[1, 1.2], [0, 1]]);
        break;
      case 'rotate45':
        const cos = Math.cos(Math.PI / 4);
        const sin = Math.sin(Math.PI / 4);
        setMatrix([[parseFloat(cos.toFixed(2)), parseFloat((-sin).toFixed(2))], [parseFloat(sin.toFixed(2)), parseFloat(cos.toFixed(2))]]);
        break;
      case 'reflect':
        setMatrix([[-1, 0], [0, 1]]);
        break;
      case 'singular': // det = 0, collapses 2D space to 1D line
        setMatrix([[1, 2], [0.5, 1]]);
        break;
      case 'scale':
        setMatrix([[1.8, 0], [0, 0.5]]);
        break;
    }
    setTransformT(1);
  };

  // Matrix animation loop
  useEffect(() => {
    let animId: number;
    if (isMatrixPlaying) {
      let forward = true;
      const step = () => {
        setTransformT((prev) => {
          if (forward) {
            if (prev >= 1) {
              forward = false;
              return 1;
            }
            return prev + 0.015;
          } else {
            if (prev <= 0) {
              forward = true;
              return 0;
            }
            return prev - 0.015;
          }
        });
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isMatrixPlaying]);

  // ----------------------------------------------------
  // 2. Calculus Derivative State
  // ----------------------------------------------------
  const [calcCurve, setCalcCurve] = useState<'parabola' | 'sine' | 'cubic'>('parabola');
  const [x0, setX0] = useState<number>(1.2);
  const [dx, setDx] = useState<number>(0.8);

  // Evaluate f(x) and f'(x)
  const evalF = (x: number) => {
    if (calcCurve === 'parabola') return 0.5 * x * x - x; // f(x) = 0.5x^2 - x
    if (calcCurve === 'sine') return Math.sin(x);
    return 0.3 * (x * x * x - 3 * x); // cubic
  };

  const evalFPrime = (x: number) => {
    if (calcCurve === 'parabola') return x - 1;
    if (calcCurve === 'sine') return Math.cos(x);
    return 0.3 * (3 * x * x - 3);
  };

  const y0 = evalF(x0);
  const y1 = evalF(x0 + dx);
  const secantSlope = (y1 - y0) / dx;
  const exactTangentSlope = evalFPrime(x0);

  // ----------------------------------------------------
  // 3. Riemann Sums State
  // ----------------------------------------------------
  const [riemannN, setRiemannN] = useState<number>(8);
  const [riemannMethod, setRiemannMethod] = useState<'left' | 'right' | 'midpoint'>('midpoint');
  const rA = 0;
  const rB = 4;
  const rEval = (x: number) => 0.2 * x * x + 0.5; // f(x) = 0.2x^2 + 0.5

  // Exact integral of 0.2x^2 + 0.5 from 0 to 4:
  // [0.2/3 x^3 + 0.5x] = (0.2/3 * 64) + 2 = 4.2667 + 2 = 6.2667
  const exactIntegral = (0.2 / 3) * Math.pow(rB, 3) + 0.5 * rB;

  // Calculate Riemann sum
  const rDx = (rB - rA) / riemannN;
  let riemannSum = 0;
  const rectangles: { x: number; width: number; height: number }[] = [];
  for (let i = 0; i < riemannN; i++) {
    const rxLeft = rA + i * rDx;
    let evalX = rxLeft;
    if (riemannMethod === 'right') evalX = rxLeft + rDx;
    if (riemannMethod === 'midpoint') evalX = rxLeft + rDx / 2;
    const h = rEval(evalX);
    riemannSum += h * rDx;
    rectangles.push({ x: rxLeft, width: rDx, height: h });
  }

  // ----------------------------------------------------
  // 4. Fourier Wave Synthesizer State
  // ----------------------------------------------------
  const [fourierHarmonics, setFourierHarmonics] = useState<number>(5);
  const [fourierWaveType, setFourierWaveType] = useState<'square' | 'sawtooth'>('square');
  const [fourierTime, setFourierTime] = useState<number>(0);
  const [isFourierPlaying, setIsFourierPlaying] = useState<boolean>(true);
  const fourierCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animId: number;
    if (isFourierPlaying) {
      const loop = () => {
        setFourierTime((t) => t + 0.03);
        animId = requestAnimationFrame(loop);
      };
      animId = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(animId);
  }, [isFourierPlaying]);

  // Fourier Canvas Drawer
  useEffect(() => {
    const canvas = fourierCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Coordinate origin for epicycles
    const originX = 140;
    const originY = height / 2;

    let x = originX;
    let y = originY;

    // Epicycles
    const numHarmonics = fourierHarmonics;
    for (let i = 0; i < numHarmonics; i++) {
      let n = 2 * i + 1; // square wave odd harmonics: 1, 3, 5...
      let radiusScale = 60 * (4 / (n * Math.PI));

      if (fourierWaveType === 'sawtooth') {
        n = i + 1; // 1, 2, 3, 4...
        radiusScale = 50 * (2 / (n * Math.PI)) * (i % 2 === 0 ? 1 : -1);
      }

      const prevX = x;
      const prevY = y;
      const angle = n * fourierTime;

      x += radiusScale * Math.cos(angle);
      y += radiusScale * Math.sin(angle);

      // Circle
      ctx.beginPath();
      ctx.arc(prevX, prevY, Math.abs(radiusScale), 0, 2 * Math.PI);
      ctx.strokeStyle = `rgba(139, 92, 246, ${Math.max(0.15, 0.5 - i * 0.08)})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Radius line
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#a78bfa';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Pivot dot
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, 2 * Math.PI);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
    }

    // Connect last epicycle tip to wave start
    const waveStartX = 260;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(waveStartX, y);
    ctx.strokeStyle = 'rgba(236, 72, 153, 0.6)';
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw synthesized wave output
    ctx.beginPath();
    const wavePoints = 220;
    for (let p = 0; p < wavePoints; p++) {
      const ptTime = fourierTime - p * 0.04;
      let waveY = originY;

      for (let i = 0; i < numHarmonics; i++) {
        let n = 2 * i + 1;
        let radiusScale = 60 * (4 / (n * Math.PI));
        if (fourierWaveType === 'sawtooth') {
          n = i + 1;
          radiusScale = 50 * (2 / (n * Math.PI)) * (i % 2 === 0 ? 1 : -1);
        }
        waveY += radiusScale * Math.sin(n * ptTime);
      }

      const px = waveStartX + p;
      if (p === 0) ctx.moveTo(px, waveY);
      else ctx.lineTo(px, waveY);
    }
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Center guideline
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    ctx.setLineDash([2, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
  }, [fourierHarmonics, fourierWaveType, fourierTime]);

  return (
    <div className="flex flex-col gap-5">
      {/* Visualizer Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-violet-500/10 text-violet-400 border border-violet-500/20">
              Interactive Mathematics Canvas
            </span>
            <span className="text-xs text-slate-400">Engineering Math</span>
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>{topic.title}</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-0.5">
            {topic.tagline}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onAskAiAboutTopic(`Explain ${topic.title} with geometric intuition and physical metaphors.`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 text-xs font-semibold border border-violet-500/30 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>AI Math Intuition</span>
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

      {/* --------------------------------------------------------- */}
      {/* MODULE 1: LINEAR TRANSFORMATIONS & MATRIX GRID DISTORTION */}
      {/* --------------------------------------------------------- */}
      {topic.id === 'math-matrix-transform' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Controls Panel (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                Transformation Matrix T
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                2D Affine Operator
              </span>
            </div>

            {/* Matrix Equation Box */}
            <div className="flex items-center justify-center p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
              <span className="text-slate-400 mr-2">T = </span>
              <div className="flex items-center border-l-2 border-r-2 border-slate-500 px-2 py-1 gap-3">
                <div className="flex flex-col gap-1 text-center">
                  <span className="text-cyan-400 font-bold">{matrix[0][0]}</span>
                  <span className="text-cyan-400 font-bold">{matrix[1][0]}</span>
                </div>
                <div className="flex flex-col gap-1 text-center">
                  <span className="text-emerald-400 font-bold">{matrix[0][1]}</span>
                  <span className="text-emerald-400 font-bold">{matrix[1][1]}</span>
                </div>
              </div>
              <div className="ml-3 text-[10px] text-slate-500 flex flex-col">
                <span className="text-cyan-400">î: ({matrix[0][0]}, {matrix[1][0]})</span>
                <span className="text-emerald-400">ĵ: ({matrix[0][1]}, {matrix[1][1]})</span>
              </div>
            </div>

            {/* Matrix Element Sliders */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono text-cyan-300 mb-1">
                  <span>î_x (Col 1, Row 1):</span>
                  <span>{matrix[0][0]}</span>
                </div>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={matrix[0][0]}
                  onChange={(e) => setMatrix([[parseFloat(e.target.value), matrix[0][1]], [matrix[1][0], matrix[1][1]]])}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-cyan-300 mb-1">
                  <span>î_y (Col 1, Row 2):</span>
                  <span>{matrix[1][0]}</span>
                </div>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={matrix[1][0]}
                  onChange={(e) => setMatrix([[matrix[0][0], matrix[0][1]], [parseFloat(e.target.value), matrix[1][1]]])}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-emerald-300 mb-1">
                  <span>ĵ_x (Col 2, Row 1):</span>
                  <span>{matrix[0][1]}</span>
                </div>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={matrix[0][1]}
                  onChange={(e) => setMatrix([[matrix[0][0], parseFloat(e.target.value)], [matrix[1][0], matrix[1][1]]])}
                  className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-emerald-300 mb-1">
                  <span>ĵ_y (Col 2, Row 2):</span>
                  <span>{matrix[1][1]}</span>
                </div>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={matrix[1][1]}
                  onChange={(e) => setMatrix([[matrix[0][0], matrix[0][1]], [matrix[1][0], parseFloat(e.target.value)]])}
                  className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Presets */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                Geometric Presets:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'identity', label: 'Identity (1,0)' },
                  { id: 'rotate45', label: 'Rotate 45°' },
                  { id: 'shear', label: 'Horiz. Shear' },
                  { id: 'reflect', label: 'Reflection Y' },
                  { id: 'scale', label: 'Scale (1.8x)' },
                  { id: 'singular', label: 'Collapse (Det=0)' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setMatrixPreset(p.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-medium transition text-left"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Determinant Metric Card */}
            <div className={`p-3 rounded-xl border font-mono text-xs ${
              Math.abs(det) < 0.05
                ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                : det < 0
                ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                : 'bg-indigo-950/40 border-indigo-800/60 text-indigo-300'
            }`}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold">Determinant det(T):</span>
                <span className="text-base font-extrabold">{det.toFixed(2)}</span>
              </div>
              <div className="text-[11px] leading-tight opacity-90">
                {Math.abs(det) < 0.05
                  ? '⚠️ Det ≈ 0: Space flattened onto a 1D line! Irreversible loss of dimension.'
                  : det < 0
                  ? '🔄 Negative Det: Unit area is inverted / plane is flipped inside out.'
                  : `Area scaling factor: Any 2D shape expands by ${det.toFixed(2)}x.`}
              </div>
            </div>
          </div>

          {/* Interactive Grid Canvas (8 cols) */}
          <div className="lg:col-span-8 flex flex-col rounded-2xl bg-slate-950 border border-slate-800 p-4 shadow-2xl">
            {/* Interpolation slider / playback */}
            <div className="flex items-center justify-between gap-4 mb-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMatrixPlaying(!isMatrixPlaying)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
                >
                  {isMatrixPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isMatrixPlaying ? 'Pause Animation' : 'Animate Morph'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsMatrixPlaying(false);
                    setTransformT(1);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Reset to Fully Transformed"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2 flex-1 max-w-xs">
                <span className="text-[11px] text-slate-400 font-mono">t = 0 (I)</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={transformT}
                  onChange={(e) => {
                    setIsMatrixPlaying(false);
                    setTransformT(parseFloat(e.target.value));
                  }}
                  className="w-full accent-violet-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-[11px] text-violet-300 font-mono font-bold">
                  {(transformT * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* SVG Visualizer */}
            <div className="relative w-full aspect-[4/3] max-h-[440px] bg-[#070b13] rounded-xl overflow-hidden flex items-center justify-center border border-slate-900">
              <svg viewBox="-250 -250 500 500" className="w-full h-full">
                {/* Defs for arrow markers */}
                <defs>
                  <marker id="arrow-i" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
                  </marker>
                  <marker id="arrow-j" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                  </marker>
                </defs>

                {/* Grid calculations */}
                {(() => {
                  const scale = 50; // pixels per unit
                  // Interpolate between Identity and Target Matrix
                  const a = (1 - transformT) * 1 + transformT * matrix[0][0];
                  const b = (1 - transformT) * 0 + transformT * matrix[0][1];
                  const c = (1 - transformT) * 0 + transformT * matrix[1][0];
                  const d = (1 - transformT) * 1 + transformT * matrix[1][1];

                  const transformPt = (x: number, y: number) => {
                    const tx = (a * x + b * y) * scale;
                    const ty = -(c * x + d * y) * scale; // invert Y for SVG
                    return { x: tx, y: ty };
                  };

                  // Generate deformed grid lines
                  const gridLines = [];
                  for (let i = -4; i <= 4; i++) {
                    const p1 = transformPt(i, -4);
                    const p2 = transformPt(i, 4);
                    gridLines.push(
                      <line
                        key={`v-${i}`}
                        x1={p1.x}
                        y1={p1.y}
                        x2={p2.x}
                        y2={p2.y}
                        stroke={i === 0 ? 'rgba(148, 163, 184, 0.6)' : 'rgba(51, 65, 85, 0.4)'}
                        strokeWidth={i === 0 ? 1.5 : 0.8}
                      />
                    );
                    const q1 = transformPt(-4, i);
                    const q2 = transformPt(4, i);
                    gridLines.push(
                      <line
                        key={`h-${i}`}
                        x1={q1.x}
                        y1={q1.y}
                        x2={q2.x}
                        y2={q2.y}
                        stroke={i === 0 ? 'rgba(148, 163, 184, 0.6)' : 'rgba(51, 65, 85, 0.4)'}
                        strokeWidth={i === 0 ? 1.5 : 0.8}
                      />
                    );
                  }

                  // Transformed unit square (0,0) -> (1,0) -> (1,1) -> (0,1)
                  const o = transformPt(0, 0);
                  const pI = transformPt(1, 0);
                  const pCorner = transformPt(1, 1);
                  const pJ = transformPt(0, 1);

                  return (
                    <>
                      {/* Grid */}
                      {gridLines}

                      {/* Transformed Unit Square Area (Determinant polygon) */}
                      <polygon
                        points={`${o.x},${o.y} ${pI.x},${pI.y} ${pCorner.x},${pCorner.y} ${pJ.x},${pJ.y}`}
                        fill="rgba(139, 92, 246, 0.25)"
                        stroke="#a78bfa"
                        strokeWidth="1.5"
                      />

                      {/* Basis vector î arrow */}
                      <line
                        x1={o.x}
                        y1={o.y}
                        x2={pI.x}
                        y2={pI.y}
                        stroke="#38bdf8"
                        strokeWidth="3.5"
                        markerEnd="url(#arrow-i)"
                      />
                      <text x={pI.x + 8} y={pI.y - 8} fill="#38bdf8" fontSize="12" fontWeight="bold">
                        î ({a.toFixed(1)}, {c.toFixed(1)})
                      </text>

                      {/* Basis vector ĵ arrow */}
                      <line
                        x1={o.x}
                        y1={o.y}
                        x2={pJ.x}
                        y2={pJ.y}
                        stroke="#10b981"
                        strokeWidth="3.5"
                        markerEnd="url(#arrow-j)"
                      />
                      <text x={pJ.x + 8} y={pJ.y - 8} fill="#10b981" fontSize="12" fontWeight="bold">
                        ĵ ({b.toFixed(1)}, {d.toFixed(1)})
                      </text>

                      {/* Origin label */}
                      <circle cx="0" cy="0" r="3.5" fill="#f8fafc" />
                      <text x="8" y="16" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                        (0,0)
                      </text>
                    </>
                  );
                })()}
              </svg>

              {/* Legend overlay */}
              <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg p-2 text-[10px] space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span className="text-slate-300">î = Column 1 (Standard X basis)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-slate-300">ĵ = Column 2 (Standard Y basis)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-violet-500/40 border border-violet-400" />
                  <span className="text-slate-300">Determinant = Shaded Square Area</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------- */}
      {/* MODULE 2: CALCULUS DERIVATIVE & SECANT TANGENT LIMIT      */}
      {/* --------------------------------------------------------- */}
      {topic.id === 'math-calculus-derivative' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Controls Panel (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                Tangent Limit Explorer
              </span>
              <span className="text-[11px] font-mono text-slate-400">Δx → 0</span>
            </div>

            {/* Curve Selector */}
            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block">
                Target Function f(x):
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'parabola', label: '0.5x² - x' },
                  { id: 'sine', label: 'sin(x)' },
                  { id: 'cubic', label: '0.3(x³ - 3x)' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCalcCurve(c.id as any)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium font-mono transition ${
                      calcCurve === c.id
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider for Point x0 */}
            <div>
              <div className="flex justify-between text-xs font-mono text-cyan-300 mb-1">
                <span>Evaluation Point x₀:</span>
                <span>{x0.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-2"
                max="2.5"
                step="0.05"
                value={x0}
                onChange={(e) => setX0(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider for Step dx */}
            <div>
              <div className="flex justify-between text-xs font-mono text-pink-300 mb-1">
                <span>Step Distance Δx (Slide towards 0!):</span>
                <span>{dx.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="1.5"
                step="0.01"
                value={dx}
                onChange={(e) => setDx(parseFloat(e.target.value))}
                className="w-full accent-pink-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Instant Tangent (0.01)</span>
                <span>Wide Secant (1.5)</span>
              </div>
            </div>

            {/* Live Slopes Comparison Card */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex justify-between items-center text-pink-400">
                <span>Secant Slope Δy/Δx:</span>
                <span className="font-bold text-sm">{secantSlope.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-400 pt-1 border-t border-slate-800">
                <span>Exact Derivative f'(x₀):</span>
                <span className="font-bold text-sm">{exactTangentSlope.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 text-[11px] pt-1 border-t border-slate-850">
                <span>Limit Error |Δ - f'|:</span>
                <span className="font-bold text-cyan-300">
                  {Math.abs(secantSlope - exactTangentSlope).toFixed(4)}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              💡 As Δx approaches 0, the pink secant line pivots and snaps directly onto the green tangent line. This is the definition of calculus differentiation!
            </p>
          </div>

          {/* Interactive Plot SVG (8 cols) */}
          <div className="lg:col-span-8 rounded-2xl bg-slate-950 border border-slate-800 p-4 shadow-2xl">
            <div className="relative w-full aspect-[4/3] max-h-[440px] bg-[#070b13] rounded-xl overflow-hidden flex items-center justify-center border border-slate-900">
              <svg viewBox="-250 -200 500 400" className="w-full h-full">
                {(() => {
                  const scaleX = 55;
                  const scaleY = 55;

                  const toSvg = (x: number, y: number) => ({
                    x: x * scaleX,
                    y: -y * scaleY,
                  });

                  // Generate curve path
                  const points = [];
                  for (let x = -3.5; x <= 3.5; x += 0.05) {
                    const y = evalF(x);
                    const pt = toSvg(x, y);
                    points.push(`${pt.x},${pt.y}`);
                  }
                  const curvePath = `M ${points.join(' L ')}`;

                  // Point 0 (x0, y0)
                  const p0 = toSvg(x0, y0);
                  // Point 1 (x0 + dx, y1)
                  const p1 = toSvg(x0 + dx, y1);

                  // Secant line extending across view
                  const secantXLeft = -3.5;
                  const secantYLeft = y0 + secantSlope * (secantXLeft - x0);
                  const secantXRight = 3.5;
                  const secantYRight = y0 + secantSlope * (secantXRight - x0);
                  const sLeftSvg = toSvg(secantXLeft, secantYLeft);
                  const sRightSvg = toSvg(secantXRight, secantYRight);

                  // Tangent line extending across view
                  const tXLeft = -3.5;
                  const tYLeft = y0 + exactTangentSlope * (tXLeft - x0);
                  const tXRight = 3.5;
                  const tYRight = y0 + exactTangentSlope * (tXRight - x0);
                  const tLeftSvg = toSvg(tXLeft, tYLeft);
                  const tRightSvg = toSvg(tXRight, tYRight);

                  return (
                    <>
                      {/* Axes */}
                      <line x1="-250" y1="0" x2="250" y2="0" stroke="rgba(71, 85, 105, 0.4)" strokeWidth="1" />
                      <line x1="0" y1="-200" x2="0" y2="200" stroke="rgba(71, 85, 105, 0.4)" strokeWidth="1" />

                      {/* Main Function Curve f(x) */}
                      <path d={curvePath} fill="none" stroke="#818cf8" strokeWidth="3" />

                      {/* Exact Tangent Line (Green) */}
                      <line
                        x1={tLeftSvg.x}
                        y1={tLeftSvg.y}
                        x2={tRightSvg.x}
                        y2={tRightSvg.y}
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />

                      {/* Secant Line (Pink) */}
                      <line
                        x1={sLeftSvg.x}
                        y1={sLeftSvg.y}
                        x2={sRightSvg.x}
                        y2={sRightSvg.y}
                        stroke="#f43f5e"
                        strokeWidth="2.5"
                      />

                      {/* Secant Triangle (Δx and Δy) */}
                      <line x1={p0.x} y1={p0.y} x2={p1.x} y2={p0.y} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
                      <line x1={p1.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
                      <text x={(p0.x + p1.x) / 2} y={p0.y + 15} fill="#38bdf8" fontSize="10" textAnchor="middle">
                        Δx = {dx.toFixed(2)}
                      </text>

                      {/* Points */}
                      <circle cx={p0.x} cy={p0.y} r="5" fill="#38bdf8" />
                      <circle cx={p1.x} cy={p1.y} r="5" fill="#f43f5e" />
                    </>
                  );
                })()}
              </svg>

              {/* Legend overlay */}
              <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg p-2 text-[10px] space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-0.5 bg-indigo-400" />
                  <span className="text-slate-300">f(x) Curve</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-0.5 bg-rose-500" />
                  <span className="text-slate-300">Secant Line [x₀, x₀+Δx]</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-0.5 border-t border-dashed border-emerald-400" />
                  <span className="text-slate-300">Tangent Line f'(x₀)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------- */}
      {/* MODULE 3: RIEMANN SUMS & DEFINITE INTEGRALS               */}
      {/* --------------------------------------------------------- */}
      {topic.id === 'math-riemann-integral' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-4 flex flex-col gap-4 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                <Grid className="w-3.5 h-3.5" />
                Riemann Integration
              </span>
              <span className="text-[11px] font-mono text-slate-400">n Slices</span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-cyan-300 mb-1">
                <span>Number of Partitions (n):</span>
                <span className="font-bold">{riemannN}</span>
              </div>
              <input
                type="range"
                min="2"
                max="50"
                step="1"
                value={riemannN}
                onChange={(e) => setRiemannN(parseInt(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Rough (2)</span>
                <span>Smooth Continuum (50)</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block">
                Sampling Method:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['left', 'midpoint', 'right'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setRiemannMethod(m)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium capitalize transition ${
                      riemannMethod === m
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex justify-between items-center text-cyan-400">
                <span>Riemann Area Approximation:</span>
                <span className="font-bold text-sm">{riemannSum.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-400 pt-1 border-t border-slate-800">
                <span>Exact Integral ∫ f(x) dx:</span>
                <span className="font-bold text-sm">{exactIntegral.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 text-[11px] pt-1 border-t border-slate-850">
                <span>Discretization Error:</span>
                <span className="font-bold text-pink-300">
                  {Math.abs(riemannSum - exactIntegral).toFixed(4)}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              💡 Notice how increasing n shrinks the jagged stair-step overhangs. As n → ∞ and dx → 0, the sum of rectangle areas becomes the exact definite integral.
            </p>
          </div>

          <div className="lg:col-span-8 rounded-2xl bg-slate-950 border border-slate-800 p-4 shadow-2xl">
            <div className="relative w-full aspect-[4/3] max-h-[440px] bg-[#070b13] rounded-xl overflow-hidden flex items-center justify-center border border-slate-900">
              <svg viewBox="-40 -20 320 220" className="w-full h-full">
                {(() => {
                  const scaleX = 60;
                  const scaleY = 35;
                  const originY = 180;

                  // Curve path
                  const curvePts = [];
                  for (let x = 0; x <= 4.2; x += 0.05) {
                    const y = rEval(x);
                    curvePts.push(`${x * scaleX},${originY - y * scaleY}`);
                  }
                  const curveD = `M ${curvePts.join(' L ')}`;

                  // Rectangles
                  const rectElements = rectangles.map((r, i) => {
                    const rx = r.x * scaleX;
                    const rw = r.width * scaleX;
                    const rh = r.height * scaleY;
                    const ry = originY - rh;
                    return (
                      <rect
                        key={i}
                        x={rx}
                        y={ry}
                        width={rw}
                        height={rh}
                        fill="rgba(56, 189, 248, 0.25)"
                        stroke="#38bdf8"
                        strokeWidth="1"
                      />
                    );
                  });

                  return (
                    <>
                      {/* Axes */}
                      <line x1="0" y1={originY} x2="260" y2={originY} stroke="rgba(148, 163, 184, 0.4)" strokeWidth="1.5" />
                      <line x1="0" y1="20" x2="0" y2={originY} stroke="rgba(148, 163, 184, 0.4)" strokeWidth="1.5" />

                      {/* Rectangles */}
                      {rectElements}

                      {/* Continuous curve */}
                      <path d={curveD} fill="none" stroke="#a78bfa" strokeWidth="2.5" />

                      {/* Labels */}
                      <text x={0} y={originY + 15} fill="#94a3b8" fontSize="10">x = 0</text>
                      <text x={4 * scaleX} y={originY + 15} fill="#94a3b8" fontSize="10" textAnchor="middle">x = 4</text>
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------- */}
      {/* MODULE 4: FOURIER SERIES HARMONIC WAVE SYNTHESIS          */}
      {/* --------------------------------------------------------- */}
      {topic.id === 'math-fourier' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-4 flex flex-col gap-4 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5" />
                Harmonic Epicycles
              </span>
              <span className="text-[11px] font-mono text-slate-400">Σ sin(nωt)/n</span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-cyan-300 mb-1">
                <span>Number of Harmonics (N):</span>
                <span className="font-bold">{fourierHarmonics}</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={fourierHarmonics}
                onChange={(e) => setFourierHarmonics(parseInt(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>1 (Pure Sine)</span>
                <span>15 (Sharp Wave)</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block">
                Target Synthesis Waveform:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFourierWaveType('square')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    fourierWaveType === 'square'
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Square Wave
                </button>
                <button
                  onClick={() => setFourierWaveType('sawtooth')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    fourierWaveType === 'sawtooth'
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Sawtooth Wave
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsFourierPlaying(!isFourierPlaying)}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
            >
              {isFourierPlaying ? <Pause className="w-4 h-4 text-cyan-400" /> : <Play className="w-4 h-4 text-cyan-400" />}
              <span>{isFourierPlaying ? 'Freeze Oscillation' : 'Resume Oscillation'}</span>
            </button>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              💡 The rotating violet circles are epicycles. Their tip traces out a rotating vector sum that unfolds into a square wave along time. The overshoot ripple at the corners is called the Gibbs Phenomenon!
            </p>
          </div>

          <div className="lg:col-span-8 rounded-2xl bg-slate-950 border border-slate-800 p-4 shadow-2xl">
            <canvas
              ref={fourierCanvasRef}
              width={520}
              height={320}
              className="w-full h-auto bg-[#070b13] rounded-xl border border-slate-900 block"
            />
          </div>
        </div>
      )}

      {/* Key Takeaway Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-violet-950/40 to-slate-900 border border-violet-900/40 flex items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-violet-300 uppercase tracking-wide">
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
    </div>
  );
};
