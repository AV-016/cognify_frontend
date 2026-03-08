"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Users, UserPlus, Mail, Phone, Building2, Stethoscope, Shield, X } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function CaregiverPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [caregivers, setCaregivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState<any>(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [adding, setAdding] = useState(false);

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [hospitalName, setHospitalName] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const token = localStorage.getItem('cognify_token');
        if (!token) { router.push('/login'); return; }
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [meRes, patientsRes] = await Promise.all([
                api.getMe(),
                api.getCaregiverPatients()
            ]);
            setProfileData(meRes);
            setCaregivers(patientsRes?.data ?? []);
        } catch (e) {
            console.error(e);
            toast.error("Failed to load caregiver data");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName(''); setEmail(''); setPhoneNumber('');
        setSpecialty(''); setHospitalName('');
        setFieldErrors({});
    };

    const handleAddCaregiver = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields
        const errors: Record<string, string> = {};
        if (!name.trim()) errors.name = 'Full name is required';
        if (!email.trim()) errors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address';
        if (!phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';
        if (!specialty.trim()) errors.specialty = 'Specialty is required';
        if (!hospitalName.trim()) errors.hospitalName = 'Hospital name is required';

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        setFieldErrors({});

        setAdding(true);
        try {
            await api.addCaregiver({ name, email, phoneNumber, specialty, hospitalName });
            toast.success("Care provider added successfully");
            setShowModal(false);
            resetForm();
            loadData();
        } catch (e: any) {
            console.error(e);
            toast.error(e.response?.data?.message || "Failed to add caregiver");
        } finally {
            setAdding(false);
        }
    };

    const profile = profileData || user;
    const profileName = profile?.name || 'User';
    const profileInitials = profileName.split(' ').length > 1
        ? `${profileName.split(' ')[0][0]}${profileName.split(' ')[1][0]}`
        : profileName.substring(0, 2).toUpperCase();

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-800 mb-1 flex items-center gap-3">
                    <Users className="text-[var(--color-primary-blue)]" size={32} />
                    Caregiver Dashboard
                </h1>
                <p className="text-gray-500 font-medium text-base">Manage your care team and personal details.</p>
            </div>

            {loading ? (
                <div className="space-y-8">
                    {/* Skeleton profile */}
                    <div className="bg-white rounded-2xl p-8 shadow-md border border-blue-50 animate-pulse">
                        <div className="h-6 w-40 bg-gray-200 rounded mb-6" />
                        <div className="flex items-start gap-6">
                            <div className="w-20 h-20 rounded-full bg-gray-200 flex-shrink-0" />
                            <div className="grid grid-cols-2 gap-4 flex-1">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i}>
                                        <div className="h-3 w-16 bg-gray-100 rounded mb-2" />
                                        <div className="h-5 w-32 bg-gray-200 rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Skeleton cards */}
                    <div className="bg-white rounded-2xl p-8 shadow-md border border-blue-50 animate-pulse">
                        <div className="h-6 w-32 bg-gray-200 rounded mb-6" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2].map(i => (
                                <div key={i} className="h-40 bg-gray-100 rounded-2xl" />
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* User Info Card */}
                    <div className="bg-white rounded-2xl p-8 shadow-md border border-blue-50">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100 flex items-center gap-2">
                            <Shield className="text-[var(--color-primary-blue)]" size={22} />
                            Your Profile
                        </h2>
                        <div className="flex items-start gap-6">
                            <div className="w-20 h-20 rounded-full bg-[var(--color-primary-blue)] flex items-center justify-center text-white text-2xl font-bold shadow-md flex-shrink-0">
                                {profileInitials}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-10 flex-1">
                                <div>
                                    <p className="text-sm text-gray-400 font-medium mb-0.5">Full Name</p>
                                    <p className="text-lg font-bold text-gray-900">{profile?.name || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400 font-medium mb-0.5">Email</p>
                                    <p className="text-lg font-semibold text-gray-700">{profile?.email || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400 font-medium mb-0.5">Age</p>
                                    <p className="text-lg font-bold text-gray-900">{profile?.age || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400 font-medium mb-0.5">Sex</p>
                                    <p className="text-lg font-bold text-gray-900">{profile?.sex || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400 font-medium mb-0.5">Role</p>
                                    <p className="text-lg font-bold text-gray-900 capitalize">{profile?.role?.toLowerCase() || '—'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Care Team */}
                    <div className="bg-white rounded-2xl p-8 shadow-md border border-blue-50">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Stethoscope className="text-[#00BFA5]" size={22} />
                                Care Team
                            </h2>
                            <div className="flex items-center gap-3">
                                <span className="bg-[#00BFA5]/10 text-[#00BFA5] text-sm font-bold px-3 py-1 rounded-full">
                                    {caregivers.length} Care Provider{caregivers.length !== 1 ? 's' : ''}
                                </span>
                                <button
                                    onClick={() => { resetForm(); setShowModal(true); }}
                                    className="bg-[var(--color-primary-blue)] hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-sm flex items-center gap-2 text-base"
                                >
                                    <UserPlus size={18} /> Add Provider
                                </button>
                            </div>
                        </div>

                        {caregivers.length === 0 ? (
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-10 text-center">
                                <Stethoscope size={40} className="mx-auto mb-3 text-blue-400 opacity-60" />
                                <p className="text-base font-bold text-blue-700 mb-1">No care providers added yet.</p>
                                <p className="text-sm font-medium text-blue-500">Click &apos;Add Provider&apos; to get started.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {caregivers.map((cg: any, i: number) => {
                                    const cgName = cg.name || 'Caregiver';
                                    const cgInitials = cgName.split(' ').length > 1
                                        ? `${cgName.split(' ')[0][0]}${cgName.split(' ')[1][0]}`
                                        : cgName.substring(0, 2).toUpperCase();

                                    return (
                                        <div key={cg.id || i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-[#00BFA5]">
                                            <div className="flex items-start gap-4">
                                                <div className="w-14 h-14 rounded-full bg-[var(--color-primary-blue)] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                                    {cgInitials}
                                                </div>
                                                <div className="min-w-0 flex-1 space-y-2">
                                                    <p className="text-xl font-bold text-gray-900 truncate">{cgName}</p>
                                                    {cg.specialty && (
                                                        <span className="inline-block bg-[#00BFA5]/10 text-[#00BFA5] text-xs font-bold px-2.5 py-1 rounded-full">
                                                            {cg.specialty}
                                                        </span>
                                                    )}
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Mail size={15} className="text-gray-400 flex-shrink-0" />
                                                        <span className="text-base font-medium truncate">{cg.email || 'Not provided'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Phone size={15} className="text-gray-400 flex-shrink-0" />
                                                        <span className="text-base font-medium">{cg.phoneNumber || 'Not provided'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Building2 size={15} className="text-gray-400 flex-shrink-0" />
                                                        <span className="text-base font-medium">{cg.hospitalName || 'Not provided'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Add Provider Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-8 relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => { setShowModal(false); resetForm(); }}
                            className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-50 text-[var(--color-primary-blue)] rounded-xl flex items-center justify-center">
                                <UserPlus size={20} className="stroke-[2.5px]" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Add Care Provider</h3>
                        </div>

                        <form onSubmit={handleAddCaregiver} className="space-y-4">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => { setName(e.target.value); setFieldErrors(prev => ({ ...prev, name: '' })); }}
                                    placeholder="e.g. Dr. Sarah Johnson"
                                    className={`w-full px-4 py-3 rounded-xl border ${fieldErrors.name ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[var(--color-primary-blue)]'} focus:outline-none focus:ring-2 text-base text-gray-800`}
                                />
                                {fieldErrors.name && <p className="text-red-500 text-xs font-medium mt-1">{fieldErrors.name}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => { setEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: '' })); }}
                                    placeholder="doctor@hospital.com"
                                    className={`w-full px-4 py-3 rounded-xl border ${fieldErrors.email ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[var(--color-primary-blue)]'} focus:outline-none focus:ring-2 text-base text-gray-800`}
                                />
                                {fieldErrors.email && <p className="text-red-500 text-xs font-medium mt-1">{fieldErrors.email}</p>}
                            </div>

                            {/* Phone + Specialty */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={phoneNumber}
                                        onChange={e => { setPhoneNumber(e.target.value); setFieldErrors(prev => ({ ...prev, phoneNumber: '' })); }}
                                        placeholder="+1 999 888 7777"
                                        className={`w-full px-4 py-3 rounded-xl border ${fieldErrors.phoneNumber ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[var(--color-primary-blue)]'} focus:outline-none focus:ring-2 text-base text-gray-800`}
                                    />
                                    {fieldErrors.phoneNumber && <p className="text-red-500 text-xs font-medium mt-1">{fieldErrors.phoneNumber}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Specialty <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={specialty}
                                        onChange={e => { setSpecialty(e.target.value); setFieldErrors(prev => ({ ...prev, specialty: '' })); }}
                                        placeholder="e.g. Neurologist"
                                        className={`w-full px-4 py-3 rounded-xl border ${fieldErrors.specialty ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[var(--color-primary-blue)]'} focus:outline-none focus:ring-2 text-base text-gray-800`}
                                    />
                                    {fieldErrors.specialty && <p className="text-red-500 text-xs font-medium mt-1">{fieldErrors.specialty}</p>}
                                </div>
                            </div>

                            {/* Hospital Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Hospital Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={hospitalName}
                                    onChange={e => { setHospitalName(e.target.value); setFieldErrors(prev => ({ ...prev, hospitalName: '' })); }}
                                    placeholder="e.g. City General Hospital"
                                    className={`w-full px-4 py-3 rounded-xl border ${fieldErrors.hospitalName ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[var(--color-primary-blue)]'} focus:outline-none focus:ring-2 text-base text-gray-800`}
                                />
                                {fieldErrors.hospitalName && <p className="text-red-500 text-xs font-medium mt-1">{fieldErrors.hospitalName}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={adding}
                                className="w-full mt-2 py-3.5 bg-[var(--color-primary-blue)] hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
                            >
                                {adding ? (
                                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Adding...</>
                                ) : (
                                    <><UserPlus size={18} /> Add Care Provider</>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
