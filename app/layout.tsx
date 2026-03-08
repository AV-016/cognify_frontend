import "./globals.css";
import React from 'react';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
    title: 'Cognify - Health Monitoring',
    description: 'A modern wellness app for health tracking',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} min-h-screen bg-[var(--color-background-white)] text-[var(--color-text-dark)] antialiased font-sans`}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
