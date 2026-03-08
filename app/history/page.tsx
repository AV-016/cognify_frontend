"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import HealthHistoryTable from '@/components/HealthHistoryTable';
import { api } from '@/lib/api';
import { RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const loadHistory = async () => {
        setLoading(true);
        try {
            const res = await api.getHealthHistory();
            if (res && res.history) {
                setHistory(res.history);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('cognify_token');
        if (!token) {
            router.push('/login');
            return;
        }
        loadHistory();
    }, [router]);

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-800 mb-1">Health History</h1>
                    <p className="text-gray-500 font-medium">Review your past synced vitals and cognitive predictions.</p>
                </div>
                <button
                    onClick={loadHistory}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            <div className="mt-6">
                {loading ? (
                    <div className="flex justify-center items-center py-20 bg-white/40 rounded-3xl border border-white">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="w-10 h-10 border-4 border-[var(--color-blush-pink)] border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-500 font-medium">Loading history...</p>
                        </div>
                    </div>
                ) : (
                    <HealthHistoryTable history={history} />
                )}
            </div>
        </DashboardLayout>
    );
}
