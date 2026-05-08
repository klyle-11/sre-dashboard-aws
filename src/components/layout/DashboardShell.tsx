import Sidebar from '@/components/layout/Sidebar';
import styles from './DashboardShell.module.scss';

interface DashboardShellProps {
    children: React.ReactNode;
    statusBar?: React.ReactNode;

}

export default function DashboardShell({ children }: DashboardShellProps) {
    return (
        <div className={styles.shell}>
            <div className={styles.shell__sidebar}>
                <Sidebar />
                <main className={styles.shell__main}>
                    {children}
                </main>
                {statusBar && <div className={styles.shell__status}>{statusBar}</div>}
            </div>
        </div>
    );
}