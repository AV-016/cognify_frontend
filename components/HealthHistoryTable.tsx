import React from 'react';

export default function HealthHistoryTable({ history }: { history: any[] }) {
    if (!history || history.length === 0) {
        return (
            <div className="p-12 text-center text-gray-500 bg-white/60 backdrop-blur-sm rounded-3xl border border-white shadow-sm">
                <p className="font-medium text-lg mb-2">No Health Records Found</p>
                <p className="text-sm">Your synced health records will appear here.</p>
            </div>
        );
    }

    return (
        <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-5 font-medium tracking-wider">Date & Time</th>
                            <th className="px-6 py-5 font-medium tracking-wider">Health Status</th>
                            <th className="px-6 py-5 font-medium tracking-wider">Cognitive Index</th>
                            <th className="px-6 py-5 font-medium tracking-wider">Stability</th>
                            <th className="px-6 py-5 font-medium tracking-wider">Vitals (HR/SpO2)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {history.map((record, i) => (
                            <tr key={i} className="hover:bg-white/50 transition-colors group">
                                <td className="px-6 py-4 text-gray-800 font-medium whitespace-nowrap">
                                    {new Date(record.timestamp || record.data?.lastSync || Date.now()).toLocaleString(undefined, {
                                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium 
                    ${String(record.data?.healthStatus || '').toLowerCase().includes('good') || String(record.data?.healthStatus || '').toLowerCase().includes('stable')
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-[var(--color-blush-pink)] text-rose-800'}`}>
                                        {record.data?.healthStatus || 'Unknown'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600 font-medium">
                                    {record.data?.cognitiveIndex ? (
                                        <span className="text-[var(--color-mint-green)] font-semibold">{record.data.cognitiveIndex} / 100</span>
                                    ) : '-'}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {record.data?.predictions?.stabilityScore ? `${record.data.predictions.stabilityScore}%` : '-'}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {record.vitals ? `${record.vitals.heartRateAvg} bpm / ${record.vitals.bloodOxygenAvg}%` : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
