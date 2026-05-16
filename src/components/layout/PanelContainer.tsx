import styles from './PanelContainer.module.scss';

interface PanelContainerProps {
    title: string;
    actions?: React.ReactNode;
    loading?: boolean;
    error?: string | null;
    children: React.ReactNode;
}

export default function PanelContainer({ title, actions, loading, error, children }: PanleContainerProps) {
    return (
        <section className={styles.panel}>
            <header className={styles.panel__header}>
                <h2 className={styles.panel__title}>{title}</h2>
                {actions && <div>{actions}</div>}
            </header>
            <div className={styles.panel__body}>
                {loading && (
                    <div className={`${styles.panel__state} ${styles['panel__state--loading']}`}>
                        Loading..
                    </div>
                )}
                {error && !loading && (
                    <div className={`${styles.panel__state} ${styles['panel__state--error']}`}>
                        {error}
                    </div>
                )}
                {!loading && !error && children}
            </div>
        </section>
    );
}