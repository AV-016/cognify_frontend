import React, { useState, useEffect } from 'react';
import { Pill, CheckCircle2, Circle, Plus, X } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function MedicineReminders() {
    const [meds, setMeds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Add form state
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('');
    const [frequency, setFrequency] = useState('DAILY');
    const [time, setTime] = useState('08:00');
    const [saving, setSaving] = useState(false);

    const loadMeds = async () => {
        try {
            const res = await api.getMedicineReminders();
            setMeds(res?.data ?? []);
        } catch (e) {
            console.error("Failed to load medicine reminders", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMeds();
    }, []);

    const handleToggleStatus = async (med: any) => {
        const newStatus = med.status === 'TAKEN' ? 'PENDING' : 'TAKEN';

        // Optimistic UI update
        setMeds(prev => prev.map(m => m.id === med.id ? { ...m, status: newStatus } : m));

        try {
            await api.updateMedicineStatus(med.id, { status: newStatus });
            toast.success(`Marked as ${newStatus.toLowerCase()}`);
        } catch (e: any) {
            // Revert on failure
            setMeds(prev => prev.map(m => m.id === med.id ? { ...m, status: med.status } : m));
            toast.error(e.response?.data?.message || "Failed to update status");
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.addMedicineReminder({
                name, dosage, frequency, time
            });
            toast.success("Reminder added successfully");
            setShowModal(false);
            setName(''); setDosage(''); setTime('08:00');
            loadMeds();
        } catch (e: any) {
            toast.error(e.response?.data?.message || "Failed to add reminder");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-5 shadow-md border border-blue-50 h-full flex flex-col relative">
            <div className="flex items-center justify-between gap-2 mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <Pill className="text-[var(--color-primary-blue)]" size={24} />
                    <h2 className="text-lg font-bold text-gray-800">Daily Medication</h2>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="p-1.5 bg-blue-50 text-[var(--color-primary-blue)] rounded-lg hover:bg-blue-100 transition-colors"
                >
                    <Plus size={20} />
                </button>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {loading ? (
                    <div className="animate-pulse space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
                        ))}
                    </div>
                ) : meds.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                        <Pill size={32} className="mb-2 opacity-50" />
                        <p className="font-medium text-sm">No reminders yet</p>
                    </div>
                ) : (
                    meds.map((med: any) => (
                        <div key={med.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                            <div>
                                <p className="font-bold text-gray-900 leading-tight">{med.name} <span className="text-xs text-gray-600 font-medium ml-1">{med.dosage}</span></p>
                                <p className="text-xs text-gray-600 font-medium mt-0.5">{med.time}</p>
                            </div>
                            <div>
                                <button
                                    onClick={() => handleToggleStatus(med)}
                                    className="transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                                >
                                    {med.status === 'TAKEN' ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-bold bg-[#4CAF50] text-white">
                                            <CheckCircle2 size={16} /> TAKEN
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-bold bg-[#FFC107] text-[#1A1A2E]">
                                            <Circle size={16} /> PENDING
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-50 text-[var(--color-primary-blue)] rounded-xl flex items-center justify-center">
                                <Plus size={20} className="stroke-[2.5px]" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Add Reminder</h3>
                        </div>

                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Medication Name</label>
                                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Aspirin"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] text-gray-800"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Dosage</label>
                                    <input type="text" required value={dosage} onChange={e => setDosage(e.target.value)} placeholder="e.g. 50mg"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] text-gray-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Time</label>
                                    <input type="time" required value={time} onChange={e => setTime(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] text-gray-800 font-medium"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Frequency</label>
                                <select required value={frequency} onChange={e => setFrequency(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] text-gray-800 font-medium"
                                >
                                    <option value="DAILY">Daily</option>
                                    <option value="WEEKLY">Weekly</option>
                                    <option value="AS_NEEDED">As Needed</option>
                                </select>
                            </div>

                            <button type="submit" disabled={saving}
                                className="w-full mt-4 py-3 bg-[var(--color-primary-blue)] hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {saving ? "Saving..." : "Save Reminder"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
