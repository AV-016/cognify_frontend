import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface HealthCardProps {
    title: string;
    value: string | number | null;
    unit?: string;
    icon: React.ReactNode;
    trend?: 'up' | 'down' | 'stable';
    trendValue?: string;
}

export default function HealthCard({
    title,
    value,
    unit,
    icon,
    trend,
    trendValue
}: HealthCardProps) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-md border border-blue-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-[var(--color-background-white)] rounded-2xl text-[var(--color-primary-blue)] flex items-center justify-center">
                    {icon}
                </div>

                {trend && (
                    <div className={`flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-full border
            ${trend === 'up' ? 'text-green-600 bg-green-50 border-green-200' : trend === 'down' ? 'text-red-600 bg-red-50 border-red-200' : 'text-slate-600 bg-slate-50 border-slate-200'}`}>
                        {trend === 'up' && <TrendingUp size={16} />}
                        {trend === 'down' && <TrendingDown size={16} />}
                        {trend === 'stable' && <Minus size={16} />}
                        <span>{trendValue}</span>
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-gray-700 font-medium text-sm mb-1">{title}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold tracking-tight text-gray-900">{value ?? '--'}</span>
                    {unit && <span className="text-gray-500 font-medium">{unit}</span>}
                </div>
            </div>
        </div>
    );
}
