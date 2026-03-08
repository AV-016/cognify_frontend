"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { User, Mail, Calendar, Activity, BrainCircuit, Save } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import EmergencyContacts from '@/components/EmergencyContacts';

export default function ProfilePage() {
    const { user, login } = useAuth(); // Need login to re-hydrate context if updated
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [stats, setStats] = useState({ totalRecords: 0, latestScore: 0 });

    const [editName, setEditName] = useState('');
    const [editAge, setEditAge] = useState<number | ''>('');
    const [editSex, setEditSex] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // Fetch fresh user profile
                const freshUser = await api.getMe();
                setEditName(freshUser.name || '');
                setEditAge(freshUser.age || '');
                setEditSex(freshUser.sex || 'MALE');

                // Re-hydrate context securely if it's drifting
                const currentToken = localStorage.getItem('cognify_token');
                if (currentToken) {
                    login(currentToken, freshUser);
                }

                // Load Stats
                const historyRes = await api.getHealthHistory();
                const records = historyRes?.history || [];
                let latestScore = 0;
                if (records.length > 0 && records[0].data?.cognitiveIndex) {
                    latestScore = records[0].data.cognitiveIndex;
                }

                setStats({
                    totalRecords: records.length,
                    latestScore: latestScore
                });

            } catch (e) {
                console.error("Failed to load profile data", e);
                toast.error("Failed to load profile parameters.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const updatedUser = await api.updateProfile({
                name: editName,
                age: Number(editAge),
                sex: editSex
            });

            // Sync new user object into Context and LocalStorage
            const currentToken = localStorage.getItem('cognify_token');
            if (currentToken) {
                login(currentToken, updatedUser);
            }

            toast.success("Profile updated successfully!");
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-800 mb-1">Your Profile</h1>
                <p className="text-gray-500 font-medium">Manage your Cognify account and personal details.</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20 bg-white/80 backdrop-blur-md rounded-3xl border border-white shadow-sm">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="w-10 h-10 border-4 border-blue-100 border-t-[var(--color-primary-blue)] rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-medium">Loading profile...</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Profile Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-sm flex flex-col items-center text-center transition-all duration-300 hover:shadow-md">
                            <div className="w-24 h-24 bg-gradient-to-br from-[var(--color-primary-blue)] to-[var(--color-soft-blue)] rounded-full flex items-center justify-center text-white mb-6 shadow-md">
                                <User size={40} className="stroke-[2px]" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">{user?.name || 'User'}</h2>
                            <p className="text-gray-500 border-b border-gray-100 w-full pb-6 mb-6">User Account</p>

                            <div className="w-full space-y-4 text-left">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="p-2 bg-blue-50 text-[var(--color-primary-blue)] rounded-xl flex-shrink-0">
                                        <Mail size={18} />
                                    </div>
                                    <span className="text-sm font-medium truncate" title={user?.email}>{user?.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="p-2 bg-blue-50 text-[var(--color-primary-blue)] rounded-xl flex-shrink-0">
                                        <Calendar size={18} />
                                    </div>
                                    <span className="text-sm font-medium">Profile Active</span>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contacts */}
                        <div className="mt-8">
                            <EmergencyContacts />
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        {/* Account Stats */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-sm">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Activity size={20} className="text-[var(--color-primary-blue)]" />
                                Account Statistics
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                                    <p className="text-sm font-medium text-gray-500 mb-2">Total Health Records</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-[var(--color-text-dark)]">{stats.totalRecords}</span>
                                        <span className="text-sm text-gray-400">syncs</span>
                                    </div>
                                </div>
                                <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                                    <p className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                                        <BrainCircuit size={16} className="text-[var(--color-primary-blue)]" />
                                        Latest Cognitive Score
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-[var(--color-primary-blue)]">
                                            {stats.latestScore > 0 ? stats.latestScore : '--'}
                                        </span>
                                        <span className="text-sm text-gray-400">/ 100</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Edit Profile Form */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-sm">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Edit Configuration</h3>

                            <form onSubmit={handleUpdateProfile} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] transition-all shadow-inner text-[#1A1A2E]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Age</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={editAge}
                                            onChange={e => setEditAge(Number(e.target.value))}
                                            className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] transition-all shadow-inner text-[#1A1A2E]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Sex</label>
                                        <select
                                            value={editSex}
                                            onChange={e => setEditSex(e.target.value as 'MALE' | 'FEMALE' | 'OTHER')}
                                            className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] transition-all shadow-inner text-[#1A1A2E] font-medium"
                                        >
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="relative overflow-hidden group bg-[var(--color-primary-blue)] text-white font-semibold py-3 px-8 rounded-xl hover:bg-blue-700 transition-all duration-300 hover:shadow-md disabled:opacity-70 flex items-center justify-center gap-2"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            {saving ? "Saving..." : "Save Changes"}
                                            {!saving && <Save size={18} className="transition-transform group-hover:scale-110" />}
                                        </span>
                                        <div className="absolute inset-0 h-full w-0 bg-white/20 transition-all duration-300 ease-out group-hover:w-full z-0"></div>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
