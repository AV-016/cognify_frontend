"use client";

import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative min-h-screen flex flex-col bg-[#F0F4FF] text-[var(--color-text-dark)] font-sans">
            <Navbar />
            <div className="flex flex-1 pt-16 w-full">
                <Sidebar />
                <main className="flex-1 py-8 px-6 overflow-y-auto min-w-0 transition-all duration-300">
                    {children}
                </main>
            </div>
        </div>
    );
}
