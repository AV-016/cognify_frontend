"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, History, LogOut, User, ChevronLeft, Gamepad2, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setIsExpanded(false);
                setMobileOpen(false);
            } else {
                const storedPref = localStorage.getItem('cognify_sidebar');
                if (storedPref !== null) {
                    setIsExpanded(storedPref === 'true');
                }
            }
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleSidebar = () => {
        if (isMobile) {
            setMobileOpen(!mobileOpen);
        } else {
            const newState = !isExpanded;
            setIsExpanded(newState);
            localStorage.setItem('cognify_sidebar', String(newState));
        }
    };

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'History', href: '/history', icon: History },
        { name: 'Games', href: '/games', icon: Gamepad2 },
        { name: 'Caregivers', href: '/caregiver', icon: Users },
        { name: 'Profile', href: '/profile', icon: User },
    ];

    const displayName = user?.name || 'User';
    const displayEmail = user?.email || '';
    const nameParts = displayName.split(' ');
    const initials = nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[1][0]}`
        : nameParts[0].substring(0, 2).toUpperCase();

    const showExpanded = isMobile ? mobileOpen : isExpanded;
    const sidebarWidth = showExpanded ? 'w-56' : 'w-16';

    const handleNavClick = () => {
        if (isMobile) setMobileOpen(false);
    };

    return (
        <>
            {/* Mobile overlay backdrop */}
            {isMobile && mobileOpen && (
                <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setMobileOpen(false)} />
            )}

            <aside className={`${sidebarWidth} transition-all duration-300 ease-in-out flex-shrink-0 flex flex-col py-8 bg-[var(--color-secondary-blue)] shadow-lg relative z-40
                ${isMobile ? `fixed top-16 left-0 bottom-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform` : ''}`}>

                {/* Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-6 w-6 h-6 bg-white border border-blue-200 rounded-full flex items-center justify-center text-[var(--color-primary-blue)] hover:bg-blue-50 hover:scale-110 transition-all shadow-md z-50"
                    aria-label="Toggle Sidebar"
                >
                    <ChevronLeft size={16} className={`transition-transform duration-300 ${!showExpanded ? 'rotate-180' : ''}`} />
                </button>

                <nav className={`flex-1 space-y-1.5 mt-4 ${showExpanded ? 'px-3' : 'px-2'}`}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={handleNavClick}
                                title={!showExpanded ? item.name : undefined}
                                className={`flex items-center gap-3 py-3 rounded-xl transition-all duration-200 group
                                    ${showExpanded ? 'px-4' : 'px-0 justify-center'}
                                    ${isActive
                                        ? 'bg-[var(--color-accent-teal)]/15 border-l-4 border-[var(--color-accent-teal)] text-white font-bold'
                                        : 'text-white/80 hover:bg-white/10 hover:text-white border-l-4 border-transparent'}`}
                            >
                                <item.icon size={20} className={`flex-shrink-0 ${isActive ? 'text-[var(--color-accent-teal)]' : 'group-hover:scale-110 transition-transform'}`} />
                                {showExpanded && <span className="whitespace-nowrap text-[15px]">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className={`mt-auto pt-6 border-t border-blue-400/30 ${showExpanded ? 'px-3' : 'px-2'}`}>
                    <div className={`flex items-center mb-2 ${showExpanded ? 'gap-3 px-3' : 'justify-center'} py-3`}>
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[var(--color-secondary-blue)] font-bold shadow-sm uppercase flex-shrink-0 text-sm" title={displayName}>
                            {initials}
                        </div>
                        {showExpanded && (
                            <div className="overflow-hidden min-w-0">
                                <p className="text-sm font-bold text-white truncate" title={displayName}>{displayName}</p>
                                <p className="text-xs text-blue-200 font-medium truncate" title={displayEmail}>{displayEmail || 'Patient'}</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => { logout(); if (isMobile) setMobileOpen(false); }}
                        title={!showExpanded ? "Logout" : undefined}
                        className={`w-full flex items-center gap-3 py-3 rounded-xl text-white/80 hover:bg-red-500/20 hover:text-red-200 transition-all duration-200 group font-medium
                            ${showExpanded ? 'px-4' : 'justify-center px-0'}`}
                    >
                        <LogOut size={20} className="group-hover:text-red-300 transition-colors flex-shrink-0" />
                        {showExpanded && <span className="whitespace-nowrap text-[15px]">Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}
