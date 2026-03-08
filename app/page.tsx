import { redirect } from 'next/navigation';

export default function Home() {
    // Simple redirect to dashboard, the dashboard layout or specific pages should handle auth checks
    redirect('/dashboard');
}
