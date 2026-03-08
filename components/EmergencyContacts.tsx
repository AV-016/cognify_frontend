import React, { useState, useEffect } from 'react';
import { Phone, Users, Plus, X } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function EmergencyContacts() {
    const [contacts, setContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [relationship, setRelationship] = useState('');
    const [saving, setSaving] = useState(false);

    const loadContacts = async () => {
        try {
            const res = await api.getEmergencyContacts();
            if (res && res.contacts) {
                setContacts(res.contacts);
            } else if (Array.isArray(res)) {
                setContacts(res);
            }
        } catch (e) {
            console.error("Failed to load emergency contacts", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadContacts();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.addEmergencyContact({ name, phoneNumber, relationship });
            toast.success("Emergency contact added!");
            setShowModal(false);
            setName(''); setPhoneNumber(''); setRelationship('');
            loadContacts();
        } catch (e: any) {
            toast.error(e.response?.data?.message || "Failed to add contact");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-50 relative flex flex-col h-full">
            <div className="flex items-center justify-between gap-2 mb-6 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                    <Phone className="text-red-500" size={24} />
                    <h2 className="text-lg font-bold text-gray-800">Emergency Contacts</h2>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors tooltip"
                    title="Add Contact"
                >
                    <Plus size={20} />
                </button>
            </div>

            <div className="space-y-4 flex-1">
                {loading ? (
                    <div className="animate-pulse space-y-3">
                        {[1, 2].map(i => (
                            <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
                        ))}
                    </div>
                ) : contacts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                        <Users size={32} className="mb-2 opacity-50 text-red-300" />
                        <p className="font-medium text-sm">No emergency contacts</p>
                    </div>
                ) : (
                    contacts.map((contact: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-red-50 bg-red-50/20 hover:bg-red-50/50 transition-colors">
                            <div>
                                <p className="font-bold text-gray-900 leading-tight flex items-center gap-2">
                                    {contact.name}
                                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded flex items-center justify-center bg-red-100 text-red-600">
                                        {contact.relationship}
                                    </span>
                                </p>
                                <p className="text-sm text-gray-600 font-medium mt-1 select-all">{contact.phoneNumber}</p>
                            </div>
                            <a href={`tel:${contact.phoneNumber}`} className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-sm transition-transform hover:scale-105 active:scale-95">
                                <Phone size={18} fill="currentColor" />
                            </a>
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
                            <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                                <Plus size={20} className="stroke-[3px]" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">New Contact</h3>
                        </div>

                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Jane Doe"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-800"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                                <input type="tel" required value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="+1 234 567 8900"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-800 font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Relationship</label>
                                <input type="text" required value={relationship} onChange={e => setRelationship(e.target.value)} placeholder="e.g. Spouse, Sibling"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-800"
                                />
                            </div>

                            <button type="submit" disabled={saving}
                                className="w-full mt-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {saving ? "Saving..." : "Save Contact"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
