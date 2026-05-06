import Sidebar from '@/components/layout/Sidebar';

interface DashboardShellProps {
    children: React.ReactNode;

}

export default function DashboardShell({ children }: DashboardShellProps) {
    return (
        <div className="flex h-screen bg-zinc-950 text-zinc-200">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}