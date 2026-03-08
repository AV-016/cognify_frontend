"use client";

import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Gamepad2, Brain, Hash, HelpCircle, Grid3x3, CheckCircle2, X } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const EXERCISE_META: Record<string, { icon: any; label: string; color: string }> = {
    WORD_GAME: { icon: Brain, label: 'Word Scramble', color: 'text-purple-500 bg-purple-50' },
    NUMBER_SEQUENCE: { icon: Hash, label: 'Number Memory', color: 'text-orange-500 bg-orange-50' },
    RECALL_QUIZ: { icon: HelpCircle, label: 'Recall Quiz', color: 'text-blue-500 bg-blue-50' },
    VISUAL_PATTERNS: { icon: Grid3x3, label: 'Visual Patterns', color: 'text-teal-500 bg-teal-50' },
};

/* ============================= GAME MODALS ============================= */

function WordGameModal({ data, onSubmit, onClose }: { data: any; onSubmit: (score: number) => void; onClose: () => void }) {
    const [answer, setAnswer] = useState('');
    const handleSubmit = () => {
        const score = answer.trim().toUpperCase() === (data.word || '').toUpperCase() ? 100 : 0;
        onSubmit(score);
    };
    return (
        <div className="space-y-6">
            <div className="text-center">
                <p className="text-sm text-gray-500 font-medium mb-2">Unscramble the word:</p>
                <div className="flex justify-center gap-2 mb-4">
                    {(data.scrambled || '').split('').map((c: string, i: number) => (
                        <span key={i} className="w-12 h-12 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center text-2xl font-bold shadow-sm">{c}</span>
                    ))}
                </div>
                {data.hint && <p className="text-sm text-gray-400 italic">💡 Hint: {data.hint}</p>}
            </div>
            <input
                type="text" value={answer} onChange={e => setAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg text-center font-bold text-gray-800 uppercase tracking-widest"
                autoFocus
            />
            <button onClick={handleSubmit} disabled={!answer.trim()}
                className="w-full py-3.5 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition disabled:opacity-50 text-base">
                Submit Answer
            </button>
        </div>
    );
}

function NumberSequenceModal({ data, onSubmit }: { data: any; onSubmit: (score: number) => void; onClose: () => void }) {
    const sequence: number[] = data.sequence || [];
    const [phase, setPhase] = useState<'show' | 'input'>('show');
    const [answer, setAnswer] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setPhase('input'), 3000);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = () => {
        const userSeq = answer.split(',').map(s => parseInt(s.trim(), 10));
        const match = JSON.stringify(userSeq) === JSON.stringify(sequence);
        onSubmit(match ? 100 : 0);
    };

    return (
        <div className="space-y-6">
            {phase === 'show' ? (
                <div className="text-center">
                    <p className="text-sm text-gray-500 font-medium mb-4">Memorize this sequence:</p>
                    <div className="flex justify-center gap-3 mb-4">
                        {sequence.map((n: number, i: number) => (
                            <span key={i} className="w-14 h-14 bg-orange-100 text-orange-700 rounded-xl flex items-center justify-center text-3xl font-bold shadow-sm animate-pulse">{n}</span>
                        ))}
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mt-4"><div className="bg-orange-400 h-2 rounded-full animate-[shrink_3s_linear_forwards]" /></div>
                    <p className="text-xs text-gray-400 mt-2">Disappearing in 3 seconds...</p>
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-base text-gray-700 font-semibold mb-4">Type the sequence (comma-separated):</p>
                    <input
                        type="text" value={answer} onChange={e => setAnswer(e.target.value)}
                        placeholder="e.g. 5, 8, 2, 9, 1"
                        className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg text-center font-bold text-gray-800 tracking-widest"
                        autoFocus
                    />
                    <button onClick={handleSubmit} disabled={!answer.trim()}
                        className="w-full mt-4 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition disabled:opacity-50 text-base">
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
}

function RecallQuizModal({ data, onSubmit }: { data: any; onSubmit: (score: number) => void; onClose: () => void }) {
    const [selected, setSelected] = useState<string | null>(null);
    const handleSubmit = () => {
        if (!selected) return;
        const score = selected === data.answer ? 100 : 0;
        onSubmit(score);
    };
    return (
        <div className="space-y-6">
            <p className="text-lg font-bold text-gray-800 text-center">{data.question}</p>
            <div className="grid grid-cols-2 gap-3">
                {(data.options || []).map((opt: string, i: number) => (
                    <button key={i} onClick={() => setSelected(opt)}
                        className={`py-4 px-3 rounded-xl border-2 font-bold text-base transition-all ${selected === opt ? 'border-blue-500 bg-blue-50 text-blue-700 scale-[1.02]' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                        {opt}
                    </button>
                ))}
            </div>
            {selected && (
                <button onClick={handleSubmit}
                    className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition text-base">
                    Confirm Answer
                </button>
            )}
        </div>
    );
}

function VisualPatternsModal({ data, onSubmit }: { data: any; onSubmit: (score: number) => void; onClose: () => void }) {
    const pattern: number[] = data.pattern || [];
    const [phase, setPhase] = useState<'show' | 'input'>('show');
    const [selected, setSelected] = useState<number[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => setPhase('input'), 2000);
        return () => clearTimeout(timer);
    }, []);

    const toggleCell = (idx: number) => {
        setSelected(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
    };

    const handleSubmit = () => {
        const sortedPattern = [...pattern].sort();
        const sortedSelected = [...selected].sort();
        const match = JSON.stringify(sortedPattern) === JSON.stringify(sortedSelected);
        onSubmit(match ? 100 : 0);
    };

    return (
        <div className="space-y-6">
            <p className="text-base text-gray-700 font-semibold text-center mb-2">
                {phase === 'show' ? 'Memorize the highlighted pattern:' : 'Tap the cells you remember:'}
            </p>
            <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto">
                {Array.from({ length: 9 }).map((_, idx) => {
                    const isHighlighted = phase === 'show' && pattern.includes(idx);
                    const isSelected = phase === 'input' && selected.includes(idx);
                    return (
                        <button key={idx} onClick={() => phase === 'input' && toggleCell(idx)}
                            className={`w-full aspect-square rounded-xl border-2 transition-all font-bold text-lg
                                ${isHighlighted ? 'bg-teal-400 border-teal-500 animate-pulse' : ''}
                                ${isSelected ? 'bg-teal-100 border-teal-400 text-teal-700' : ''}
                                ${!isHighlighted && !isSelected ? 'bg-gray-100 border-gray-200 hover:bg-gray-200' : ''}
                                ${phase === 'show' ? 'cursor-default' : 'cursor-pointer active:scale-95'}`}>
                            {isSelected && '✓'}
                        </button>
                    );
                })}
            </div>
            {phase === 'input' && (
                <button onClick={handleSubmit}
                    className="w-full py-3.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl transition text-base">
                    Submit Pattern
                </button>
            )}
        </div>
    );
}

/* ============================= MAIN PAGE ============================= */

export default function GamesPage() {
    const router = useRouter();
    const [exercises, setExercises] = useState<any[]>([]);
    const [goalProgress, setGoalProgress] = useState(0);
    const [loading, setLoading] = useState(true);

    const [activeGame, setActiveGame] = useState<any>(null);
    const [gameData, setGameData] = useState<any>(null);
    const [gameLoading, setGameLoading] = useState(false);
    const [resultMsg, setResultMsg] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('cognify_token');
        if (!token) { router.push('/login'); return; }
        loadDaily();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadDaily = async () => {
        try {
            const res = await api.getDailyExercises();
            setGoalProgress(res?.goalProgress || 0);
            setExercises(res?.exercises || []);
        } catch (e) {
            console.error(e);
            toast.error("Failed to load daily exercises");
        } finally {
            setLoading(false);
        }
    };

    const openGame = async (exercise: any) => {
        if (exercise.isCompleted) return;
        setGameLoading(true);
        setResultMsg(null);
        try {
            const details = await api.getExerciseDetails(exercise.id);
            setActiveGame(exercise);
            setGameData(details);
        } catch (e) {
            console.error(e);
            toast.error("Failed to load exercise");
        } finally {
            setGameLoading(false);
        }
    };

    const handleScoreSubmit = async (score: number) => {
        if (!activeGame) return;
        setSubmitting(true);
        try {
            await api.submitExerciseResult({ exerciseId: activeGame.id, score });
            setResultMsg(score >= 100 ? '✅ Correct! +100 points' : '❌ Incorrect. Try again tomorrow');
            toast.success(score >= 100 ? 'Great job!' : 'Better luck next time');
            // Refresh daily after a short delay
            setTimeout(async () => {
                await loadDaily();
                setActiveGame(null);
                setGameData(null);
                setResultMsg(null);
            }, 2000);
        } catch (e: any) {
            toast.error(e.response?.data?.message || "Failed to submit score");
        } finally {
            setSubmitting(false);
        }
    };

    const closeModal = () => {
        setActiveGame(null);
        setGameData(null);
        setResultMsg(null);
    };

    const progressPct = Math.round(goalProgress * 100);

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-800 mb-1 flex items-center gap-3">
                    <Gamepad2 className="text-[var(--color-primary-blue)]" size={32} />
                    Cognitive Games
                </h1>
                <p className="text-gray-500 font-medium text-base">Daily exercises to keep your brain sharp.</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20 bg-white rounded-3xl border border-blue-50 shadow-sm">
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 border-4 border-blue-100 border-t-[var(--color-primary-blue)] rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-medium text-base">Loading exercises...</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Progress Header */}
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-blue-50">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-bold text-gray-800">Daily Goal</h2>
                            <span className="text-sm font-bold text-[var(--color-primary-blue)]">{progressPct}% Complete</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
                            <div
                                className="h-4 rounded-full bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-accent-teal)] transition-all duration-700 ease-out"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                    </div>

                    {/* Exercise Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {exercises.map((ex: any, i: number) => {
                            const meta = EXERCISE_META[ex.type] || EXERCISE_META['WORD_GAME'];
                            const IconComp = meta.icon;
                            const colorClasses = meta.color;

                            return (
                                <button
                                    key={ex.id || i}
                                    onClick={() => openGame(ex)}
                                    disabled={ex.isCompleted || gameLoading}
                                    className={`text-left bg-white p-6 rounded-2xl shadow-md border border-blue-50 transition-all duration-300 
                                        ${ex.isCompleted ? 'opacity-80 cursor-default' : 'hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] cursor-pointer'}`}
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`p-3 rounded-xl ${colorClasses}`}>
                                            <IconComp size={28} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-lg font-bold text-gray-900">{meta.label}</p>
                                            <p className="text-sm text-gray-500 font-medium capitalize">{ex.type?.toLowerCase().replace(/_/g, ' ')}</p>
                                        </div>
                                    </div>
                                    {ex.isCompleted ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-green-100 text-green-700">
                                            <CheckCircle2 size={16} /> Done
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-blue-100 text-blue-700">
                                            🔵 Start
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Game Modal */}
            {(activeGame && gameData) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
                            <X size={24} />
                        </button>

                        <div className="mb-6 text-center">
                            <h3 className="text-xl font-bold text-gray-800">
                                {EXERCISE_META[activeGame.type]?.label || 'Game'}
                            </h3>
                        </div>

                        {resultMsg ? (
                            <div className={`text-center py-8 text-2xl font-bold ${resultMsg.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
                                {resultMsg}
                            </div>
                        ) : submitting ? (
                            <div className="flex justify-center py-12">
                                <div className="w-10 h-10 border-4 border-blue-100 border-t-[var(--color-primary-blue)] rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <>
                                {activeGame.type === 'WORD_GAME' && <WordGameModal data={gameData} onSubmit={handleScoreSubmit} onClose={closeModal} />}
                                {activeGame.type === 'NUMBER_SEQUENCE' && <NumberSequenceModal data={gameData} onSubmit={handleScoreSubmit} onClose={closeModal} />}
                                {activeGame.type === 'RECALL_QUIZ' && <RecallQuizModal data={gameData} onSubmit={handleScoreSubmit} onClose={closeModal} />}
                                {activeGame.type === 'VISUAL_PATTERNS' && <VisualPatternsModal data={gameData} onSubmit={handleScoreSubmit} onClose={closeModal} />}
                            </>
                        )}
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
