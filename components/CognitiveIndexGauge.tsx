import React from 'react';

export default function CognitiveIndexGauge({ score }: { score: number | null }) {
    if (score === null || score === undefined) {
        return (
            <div className="bg-white rounded-2xl p-5 shadow-md border border-blue-50 flex flex-col items-center justify-center relative hover:-translate-y-1 transition-transform duration-300 h-full">
                <h3 className="text-gray-700 font-bold text-base mb-4">Cognitive Index</h3>
                <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                        <circle
                            cx="50" cy="50" r={40}
                            fill="transparent"
                            stroke="#E2E8F0"
                            strokeWidth="8"
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-lg font-bold text-gray-400">No data yet</span>
                    </div>
                </div>
                <p className="mt-4 text-base text-gray-400 font-bold">Sync your health data</p>
            </div>
        );
    }

    // Color coding
    let colorClass = 'text-[var(--color-primary-blue)]';
    let strokeClass = 'stroke-[var(--color-primary-blue)]';
    if (score < 60) {
        colorClass = 'text-red-600';
        strokeClass = 'stroke-red-500';
    } else if (score < 80) {
        colorClass = 'text-amber-600';
        strokeClass = 'stroke-amber-500';
    } else {
        colorClass = 'text-green-600';
        strokeClass = 'stroke-green-500';
    }

    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="bg-white rounded-2xl p-5 shadow-md border border-blue-50 flex flex-col items-center justify-center relative hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-gray-700 font-bold text-base mb-4">Cognitive Index</h3>
            <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                    <circle
                        cx="50" cy="50" r={radius}
                        fill="transparent"
                        stroke="#E2E8F0"
                        strokeWidth="8"
                    />
                    <circle
                        cx="50" cy="50" r={radius}
                        fill="transparent"
                        className={`${strokeClass} transition-all duration-1000 ease-out`}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                    <span className={`text-4xl font-extrabold ${colorClass}`}>{score}</span>
                    <span className="text-sm font-bold text-gray-500">/ 100</span>
                </div>
            </div>
            <p className="mt-4 text-base text-gray-800 font-bold capitalize">
                {score >= 80 ? 'Optimal' : score >= 60 ? 'Stable' : 'Needs Attention'}
            </p>
        </div>
    );
}
