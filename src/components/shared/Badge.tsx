import styles from './Badge.module.scss';

interface BadgeProps {
    label: string,
    variant: 'ok' | 'error' | 'warning' | 'info' | 'neutral';
}

export default function Badge({ label, variant }: BadgeProps) {
    return (
        <span className={`${styles.badge} ${styles[`badge--${variant}`]}`}>
            {label}
        </span>
    );
}