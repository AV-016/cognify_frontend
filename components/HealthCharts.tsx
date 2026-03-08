"use client";

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from 'recharts';

export default function HealthCharts({ data }: { data: any[] }) {
    const chartData = data && data.length > 0 ? data.slice(0, 7).reverse() : [
        { day: "Mon", heartRate: 72, sleep: 7.1, score: 81 },
        { day: "Tue", heartRate: 75, sleep: 6.8, score: 79 },
        { day: "Wed", heartRate: 70, sleep: 7.5, score: 84 },
        { day: "Thu", heartRate: 73, sleep: 7.2, score: 82 },
        { day: "Fri", heartRate: 76, sleep: 6.5, score: 78 },
        { day: "Sat", heartRate: 68, sleep: 8.1, score: 88 },
        { day: "Sun", heartRate: 71, sleep: 7.8, score: 86 },
    ];

    const formattedData = chartData.map((d: any) => {
        if (d.timestamp) {
            const date = new Date(d.timestamp);
            return {
                ...d,
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                heartRate: d.vitals?.heartRateAvg || 70,
                sleep: d.sleep?.totalHours || 7,
                score: d.data?.cognitiveIndex || 80
            };
        }
        return d;
    });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Cognitive Score Trend */}
            <div className="bg-white rounded-2xl shadow-md border border-blue-50 p-5 hover:shadow-lg transition-all duration-300">
                <h2 className="text-lg font-bold mb-6 text-gray-800 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-background-white)] flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-[var(--color-primary-blue)]"></div>
                    </div>
                    Cognitive Index Trend
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={formattedData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }} domain={['dataMin - 5', 'dataMax + 5']} />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', color: '#1E293B', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                            cursor={{ stroke: '#CBD5E1', strokeWidth: 1, strokeDasharray: '3 3' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="score"
                            name="Cognitive Score"
                            stroke="var(--color-primary-blue)"
                            strokeWidth={3}
                            dot={{ stroke: 'var(--color-primary-blue)', strokeWidth: 2, r: 4, fill: '#fff' }}
                            activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--color-primary-blue)' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Heart Rate Trend */}
            <div className="bg-white rounded-2xl shadow-md border border-blue-50 p-5 hover:shadow-lg transition-all duration-300">
                <h2 className="text-lg font-bold mb-6 text-gray-800 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    </div>
                    Heart Rate Trend
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={formattedData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }} domain={['dataMin - 5', 'dataMax + 5']} />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', color: '#1E293B', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                            cursor={{ stroke: '#CBD5E1', strokeWidth: 1, strokeDasharray: '3 3' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="heartRate"
                            name="Avg Heart Rate (bpm)"
                            stroke="#EF4444"
                            strokeWidth={3}
                            dot={{ stroke: '#EF4444', strokeWidth: 2, r: 4, fill: '#fff' }}
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#EF4444' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Sleep Trend */}
            <div className="bg-white rounded-2xl shadow-md border border-blue-50 p-5 hover:shadow-lg transition-all duration-300">
                <h2 className="text-lg font-bold mb-6 text-gray-800 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-[var(--color-accent-teal)]"></div>
                    </div>
                    Sleep Duration Over Time
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={formattedData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }} domain={[0, 12]} />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', color: '#1E293B', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                            cursor={{ stroke: '#CBD5E1', strokeWidth: 1, strokeDasharray: '3 3' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="sleep"
                            name="Sleep (hrs)"
                            stroke="var(--color-accent-teal)"
                            strokeWidth={3}
                            dot={{ stroke: 'var(--color-accent-teal)', strokeWidth: 2, r: 4, fill: '#fff' }}
                            activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--color-accent-teal)' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
