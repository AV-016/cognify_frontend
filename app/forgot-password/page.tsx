"use client";

import React, { useState } from 'react';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleForgot = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            await api.forgotPassword(email);
            setSuccessMsg("If this email exists, a reset link has been sent.");
        } catch (e: any) {
            console.error(e);
            const msg = e.response?.data?.message || e.message || "Failed to process request. Please try again.";
            setErrorMsg(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--color-light-blue)] to-white flex items-center justify-center p-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 w-full max-w-md shadow-lg shadow-blue-100/50 border border-white transition-all duration-500 hover:shadow-xl">
                <div className="flex flex-col items-center mb-8 relative">
                    <Link href="/login" className="absolute left-0 top-1 text-gray-400 hover:text-[var(--color-primary-blue)] transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <div className="p-4 bg-gradient-to-br from-[var(--color-primary-blue)] to-[var(--color-soft-blue)] rounded-full mb-5 shadow-sm transform transition hover:scale-105">
                        <Mail size={32} className="text-white stroke-[2.5px]" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#1A1A2E]">Forgot Password</h1>
                    <p className="text-gray-500 mt-2 text-center text-sm font-medium">Enter your email to receive a reset token</p>
                </div>

                <form onSubmit={handleForgot} className="space-y-5">
                    {errorMsg && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 flex items-center justify-center">
                            {errorMsg}
                        </div>
                    )}
                    {successMsg && (
                        <div className="bg-green-600 text-white p-4 rounded-xl text-sm shadow-md flex flex-col items-center justify-center text-center space-y-3">
                            <p className="font-bold text-base">{successMsg}</p>
                            <Link href="/reset-password" className="mt-3 inline-block text-green-50 hover:text-white hover:underline font-semibold decoration-2 underline-offset-4">
                                Continue to Reset Password &rarr;
                            </Link>
                        </div>
                    )}

                    {!successMsg && (
                        <>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full pl-11 pr-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] focus:border-transparent transition-all shadow-inner text-[#1A1A2E]"
                                        placeholder="Enter your registered email"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !email}
                                className="w-full relative overflow-hidden group bg-[var(--color-primary-blue)] text-white font-semibold text-lg py-4 rounded-2xl hover:bg-blue-700 transition-all duration-300 hover:shadow-lg disabled:opacity-70 mt-6 flex items-center justify-center gap-2"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {loading ? "Sending..." : "Send Reset Link"}
                                    {!loading && <Send size={18} className="transition-transform group-hover:translate-x-1" />}
                                </span>
                                <div className="absolute inset-0 h-full w-0 bg-white/20 transition-all duration-300 ease-out group-hover:w-full z-0"></div>
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
