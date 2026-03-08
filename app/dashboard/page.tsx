"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import HealthCard from '@/components/HealthCard';
import SyncButton from '@/components/SyncButton';
import HealthCharts from '@/components/HealthCharts';
import CognitiveIndexGauge from '@/components/CognitiveIndexGauge';
import AiInsightsCard from '@/components/AiInsightsCard';
import MedicineReminders from '@/components/MedicineReminders';
import { Activity, HeartPulse, Wind, Moon } from 'lucide-react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [analysisStep, setAnalysisStep] = useState(0);
    const [prediction, setPrediction] = useState<any>(null);
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [vitals, setVitals] = useState<{
        steps: number | null,
        heartRateAvg: number | null,
        bloodOxygenAvg: number | null,
        sleep: number | null
    }>({
        steps: null, heartRateAvg: null, bloodOxygenAvg: null, sleep: null
    });
    const [currentTime, setCurrentTime] = useState(new Date());
    const router = useRouter();
    const { user } = useAuth();

    const analysisSteps = [
        "Analyzing vitals...",
        "Comparing baselines...",
        "Detecting trends...",
        "Generating insights..."
    ];

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('cognify_token');
        if (!token) {
            router.push('/login');
        }

        const loadInitialData = async () => {
            try {
                // Fetch Latest Health
                const latestRes = await api.getLatestHealth();
                const health = latestRes?.data;
                if (health) {
                    setVitals({
                        steps: health.steps ?? 0,
                        heartRateAvg: health.heartRateAvg ?? 0,
                        bloodOxygenAvg: health.bloodOxygenAvg ?? 0,
                        sleep: health.sleepTotalHours ?? 0
                    });
                    setPrediction({
                        cognitiveIndex: health.cognitiveIndex ?? 0,
                        healthStatus: health.healthStatus ?? 'Unknown',
                        insights: health.aiInsights ?? []
                    });
                }

                // Fetch History
                const historyRes = await api.getHealthHistory();
                if (historyRes?.data && historyRes.data.length > 0) {
                    setHistoryData(historyRes.data);
                }
            } catch (e) {
                console.error("Failed to load dashboard data", e);
            }
        };

        loadInitialData();
    }, [router]);

    const handleSync = async () => {
        setLoading(true);
        setAnalysisStep(0);

        for (let i = 0; i < analysisSteps.length; i++) {
            setAnalysisStep(i);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        setAnalysisStep(analysisSteps.length);

        try {
            const payload = {
                timestamp: new Date().toISOString(),
                vitals: { steps: 6000, heartRateAvg: 72, hrvSdnnMs: 45, bloodOxygenAvg: 98 },
                movement: { gaitSpeedMs: 1.1, stepCadence: 100, walkingAsymmetry: 0.02 },
                sleep: { totalHours: 7, deepSleepHours: 2, remSleepHours: 1.5, latencyMinutes: 15, awakenings: 1 },
                cognitivePerformance: { reactionTimeMs: 250, memoryScore: 80, testType: "daily" }
            };

            const res = await api.syncHealthData(payload);
            if (res?.data) {
                setPrediction({
                    cognitiveIndex: res.data.cognitiveIndex,
                    healthStatus: res.data.healthStatus,
                    insights: res.data.aiInsights ?? []
                });
                setHistoryData(prev => [{
                    timestamp: payload.timestamp,
                    vitals: payload.vitals,
                    sleep: payload.sleep,
                    data: res.data
                }, ...prev]);

                setVitals({
                    steps: res.data.steps,
                    heartRateAvg: res.data.heartRateAvg,
                    bloodOxygenAvg: res.data.bloodOxygenAvg,
                    sleep: res.data.sleepTotalHours
                });

                toast.success("Health data synced successfully!");
            }
        } catch (e: any) {
            console.error(e);
            toast.error(e.response?.data?.message || e.message || "Failed to sync health data");
            setAnalysisStep(0);
        } finally {
            setTimeout(() => {
                setLoading(false);
                setAnalysisStep(0);
            }, 500);
        }
    };

    const currentDateStr = currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const currentTimeStr = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Dynamic greeting calculation
    const hour = currentTime.getHours();
    let timeOfDay = 'morning';
    if (hour >= 12 && hour < 17) {
        timeOfDay = 'afternoon';
    } else if (hour >= 17 || hour < 5) {
        timeOfDay = 'evening';
    }
    const displayName = user?.name || '';
    const firstName = displayName.split(' ')[0] || 'there';
    const dynamicGreeting = `Good ${timeOfDay}, ${firstName}`;

    return (
        <DashboardLayout>
            {/* Greeting Header */}
            <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm border border-blue-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-800 mb-1">{dynamicGreeting} 👋</h1>
                    <p className="text-gray-500 font-medium">Here's your health summary for <span className="text-[var(--color-primary-blue)] font-semibold">{currentDateStr}</span></p>
                </div>
                <div className="flex flex-col items-start md:items-end gap-3">
                    <div className="text-xl font-bold text-gray-700 bg-[var(--color-background-white)] px-4 py-2 rounded-xl border border-blue-50">
                        {currentTimeStr}
                    </div>
                    <SyncButton onSync={handleSync} isLoading={loading} />
                </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl px-6 py-3 mb-6 text-center">
  <p className="text-sm text-blue-700 font-medium">
    For using our services correctly, please use our App and follow guidelines as provided.
  </p>
</div>

            {/* Health Metrics Row */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <HealthCard
                    title="Daily Steps"
                    value={vitals.steps != null ? vitals.steps.toLocaleString() : '--'}
                    icon={<Activity size={24} />}
                    trend="up"
                    trendValue="+12%"
                />
                <HealthCard
                    title="Avg Heart Rate"
                    value={vitals.heartRateAvg}
                    unit="bpm"
                    icon={<HeartPulse size={24} />}
                    trend="stable"
                    trendValue="Normal"
                />
                <HealthCard
                    title="Blood Oxygen"
                    value={vitals.bloodOxygenAvg}
                    unit="%"
                    icon={<Wind size={24} />}
                    trend="up"
                    trendValue="+1%"
                />
                <HealthCard
                    title="Sleep Duration"
                    value={vitals.sleep}
                    unit="hrs"
                    icon={<Moon size={24} />}
                    trend="down"
                    trendValue="-30m"
                />
            </div>

            {/* Loading / Insights Row */}
            <div className="mb-6 transition-all duration-700 ease-in-out">
                {loading ? (
                    <div className="bg-white rounded-3xl p-8 border border-blue-50 shadow-md animate-in fade-in zoom-in-95 duration-500">
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-[var(--color-background-white)] border-t-[var(--color-primary-blue)] rounded-full animate-spin"></div>
                                <Activity className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[var(--color-primary-blue)]" size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mt-4">Analyzing your health data...</h2>
                            <p className="text-sm text-gray-500 mt-1">Processing your latest vitals</p>
                        </div>

                        <div className="max-w-md mx-auto">
                            <div className="space-y-4 mb-6">
                                {analysisSteps.map((step, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center gap-3 transition-opacity duration-500 ${index <= analysisStep ? 'opacity-100' : 'opacity-30'}`}
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs transition-colors duration-500
                                            ${index < analysisStep ? 'bg-[var(--color-primary-blue)]' : index === analysisStep ? 'bg-blue-400 animate-pulse' : 'bg-gray-200 text-gray-500'}`}
                                        >
                                            {index < analysisStep ? '✓' : index + 1}
                                        </div>
                                        <span className={`text-sm ${index <= analysisStep ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                                            {step}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden shadow-inner">
                                <div
                                    className="bg-[var(--color-primary-blue)] h-2 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${Math.min(100, (analysisStep / analysisSteps.length) * 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-center text-gray-500 font-medium">
                                {Math.min(100, Math.round((analysisStep / analysisSteps.length) * 100))}% Complete
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 items-stretch">
                        <div className="md:col-span-1">
                            <CognitiveIndexGauge score={prediction?.cognitiveIndex ?? null} />
                        </div>
                        <div className="md:col-span-1">
                            <AiInsightsCard insights={prediction?.insights ?? []} />
                        </div>
                        <div className="md:col-span-1">
                            <MedicineReminders />
                        </div>
                    </div>
                )}
            </div>

            {/* Health Charts Section */}
            <div>
                <HealthCharts data={historyData} />
            </div>
        </DashboardLayout>
    );
}
