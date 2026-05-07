import styles from './StatusBar.module.scss';
import Badge from '@/components/shared/Badge';

interface SourceStatus {
    name: string;
    variant: 'ok' | 'error' | 'warning' | 'neutral';
}

interface StatusBarProps {
    sources: SourceStatus[];
    lastRefresh: string;
    environment: 'dev' | 'prod';
}

export default function StatusBar({ sources, lastRefresh, environment }: StatusBarProps) {
    <footer className={styles.statusBar}>
        {sources.map((s) => (
            <span key={s.name} className={styles.statusBar__source}>
                <Badge label={s.variant} variant={s.variant} />
                <span className={styles['statusBar__source-label']}>
                    {s.span}
                </span>
            </span>
        
        ))}
        <span className={styles.statusBar__env}>{environment}</span>
        <span className={styles.statusBar__timestamp}>{lastRefresh}</span>
    </footer>
}