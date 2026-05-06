import styles from './Skeleton.module.scss';

interface SkeletonProps {
    className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div 
            className={`${styles.skeleton} ${className}`}
            role="status"
            aria-label="Loading"
        />
    );
}