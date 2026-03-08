"use client";

import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState<number | ''>('');
    const [sex, setSex] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password || !age || !sex) {
            setErrorMsg("Please fill in all fields.");
            return;
        }

        setLoading(true);
        setErrorMsg('');
        try {
            await api.register({
                name,
                email,
                password,
                age: Number(age),
                sex,
            });
            toast.success("Account created successfully!");
            router.push('/login');
        } catch (e: any) {
            console.error(e);
            setErrorMsg(e.response?.data?.message || e.response?.data?.error || e.message || "Registration failed. Please try again.");
            toast.error("Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-background-white)] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-[120px] opacity-20 -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary-blue)] rounded-full blur-[120px] opacity-20 -ml-20 -mb-20"></div>

            <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 relative z-10">
                <div className="flex justify-center mb-6 text-[var(--color-primary-blue)]">
                    <Activity size={48} strokeWidth={2.5} />
                </div>

                <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2">Create Account</h1>
                <p className="text-center text-gray-500 mb-8 font-medium">Join Cognify today</p>

                {errorMsg && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] focus:border-transparent transition-all shadow-inner"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] focus:border-transparent transition-all shadow-inner"
                            placeholder="user@cognify.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] focus:border-transparent transition-all shadow-inner"
                            placeholder="Create a password"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Age</label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={age}
                                onChange={e => setAge(Number(e.target.value))}
                                className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] focus:border-transparent transition-all shadow-inner"
                                placeholder="Age"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Sex</label>
                            <select
                                value={sex}
                                onChange={e => setSex(e.target.value as 'MALE' | 'FEMALE' | 'OTHER')}
                                className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] focus:border-transparent transition-all shadow-inner text-gray-700 font-medium"
                            >
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 px-6 rounded-2xl text-white font-bold text-lg transition-all duration-300 shadow-md flex items-center justify-center gap-2 mt-2
                            ${loading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-[var(--color-primary-blue)] hover:bg-[var(--color-secondary-blue)] hover:shadow-lg hover:-translate-y-0.5'}`}
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Creating...
                            </>
                        ) : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-500 font-medium">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[var(--color-primary-blue)] hover:underline font-bold">
                            Login Here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
