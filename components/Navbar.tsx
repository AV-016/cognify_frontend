import React from 'react';
import { Activity, User } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
    return (
        <header className="h-16 fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-blue-100 flex items-center justify-between px-6 shadow-sm">
            <Link href="/dashboard" className="flex items-center gap-2 text-[var(--color-primary-blue)] hover:opacity-80 transition-opacity">
                <Activity size={24} className="stroke-[2.5px]" />
                <span className="text-xl font-semibold tracking-tight text-[var(--color-text-dark)]">Cognify</span>
            </Link>

            <div className="flex items-center gap-4">
                <Link href="/profile" className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-[var(--color-primary-blue)] hover:bg-blue-100 transition-colors duration-300 shadow-sm border border-blue-100">
                    <User size={20} />
                </Link>
            </div>
        </header>
    );
}
