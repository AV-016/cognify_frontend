import React from 'react';
import { RefreshCw } from 'lucide-react';

interface SyncButtonProps {
    onSync: () => void;
    isLoading: boolean;
}

export default function SyncButton({ onSync, isLoading }: SyncButtonProps) {
    return (
        <button
            onClick={onSync}
            disabled={isLoading}
            className={`
        flex items-center gap-2 px-6 py-3 rounded-full font-medium text-white shadow-sm transition-all duration-300
        ${isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-[var(--color-primary-blue)] hover:bg-blue-600 hover:shadow-md hover:-translate-y-0.5'}
      `}
        >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            <span>{isLoading ? 'Syncing Vitals...' : 'Sync Health Data'}</span>
        </button>
    );
}
