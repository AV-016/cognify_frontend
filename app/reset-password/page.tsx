"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { KeyRound, ArrowLeft, Lock, Save } from 'lucide-react';
import { api } from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const tokenParams = searchParams.get('token');

    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (tokenParams) {
            setToken(tokenParams);
        }
    }, [tokenParams]);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            await api.resetPassword(token, password);
            setSuccessMsg("Password reset successfully! Redirecting to login...");
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (e: any) {
            console.error(e);
            const msg = e.response?.data?.message || e.message || "Failed to reset password. Please verify your token.";
            setErrorMsg(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleReset} className="space-y-5">
            {errorMsg && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 flex items-center justify-center font-medium">
                    {errorMsg}
                </div>
            )}
            {successMsg && (
                <div className="bg-green-600 text-white p-4 rounded-xl text-sm font-bold shadow-md flex flex-col items-center justify-center text-center">
                    <p>{successMsg}</p>
                </div>
            )}

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reset Token</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <KeyRound className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        required
                        value={token}
                        onChange={e => setToken(e.target.value)}
                        className="w-full pl-11 pr-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] focus:border-transparent transition-all shadow-inner font-mono text-sm text-[#1A1A2E]"
                        placeholder="Paste your reset token here"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        minLength={6}
                        className="w-full pl-11 pr-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] focus:border-transparent transition-all shadow-inner text-[#1A1A2E]"
                        placeholder="Enter your new password"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading || !token || !password || successMsg.length > 0}
                className="w-full relative overflow-hidden group bg-[var(--color-primary-blue)] text-white font-semibold text-lg py-4 rounded-2xl hover:bg-blue-700 transition-all duration-300 hover:shadow-lg disabled:opacity-70 mt-6 flex items-center justify-center gap-2"
            >
                <span className="relative z-10 flex items-center gap-2">
                    {loading ? "Resetting..." : "Save New Password"}
                    {!loading && <Save size={18} className="transition-transform group-hover:scale-110" />}
                </span>
                <div className="absolute inset-0 h-full w-0 bg-white/20 transition-all duration-300 ease-out group-hover:w-full z-0"></div>
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--color-light-blue)] to-white flex items-center justify-center p-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 w-full max-w-md shadow-lg shadow-blue-100/50 border border-white transition-all duration-500 hover:shadow-xl">
                <div className="flex flex-col items-center mb-8 relative">
                    <Link href="/login" className="absolute left-0 top-1 text-gray-400 hover:text-[var(--color-primary-blue)] transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <div className="p-4 bg-gradient-to-br from-[var(--color-primary-blue)] to-[var(--color-soft-blue)] rounded-full mb-5 shadow-sm transform transition hover:scale-105">
                        <KeyRound size={32} className="text-white stroke-[2.5px]" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#1A1A2E]">Reset Password</h1>
                    <p className="text-gray-500 mt-2 text-center text-sm font-medium">Enter your reset token and new password</p>
                </div>
                <Suspense fallback={<div className="text-center p-4">Loading form...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
