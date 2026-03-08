import React from 'react';
import { BrainCircuit } from 'lucide-react';

export default function AiInsightsCard({ insights }: { insights: string[] }) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-md border border-blue-50 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                <BrainCircuit className="text-[var(--color-primary-blue)]" size={24} />
                <h2 className="text-lg font-bold text-gray-800">AI Health Insights</h2>
            </div>
            <div className="space-y-4 flex-1">
                {insights && insights.length > 0 ? (
                    insights.map((insight, idx) => (
                        <div key={idx} className="flex gap-3 items-start border-l-4 border-[var(--color-accent-teal)] pl-3 bg-gray-50 p-3 rounded-r-lg">
                            <p className="text-sm text-gray-900 leading-relaxed font-bold">{insight}</p>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                        <p className="text-sm font-medium">No insights available yet. Sync your health data.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
