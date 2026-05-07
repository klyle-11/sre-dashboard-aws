'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.scss';

interface NavItem {
    label: string;
    href: string;
    letter: string;
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Tracing', href: '/tracing', letter: 'T' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebar__header}>
                <h1 className={styles.sidebar__title}>
                    M-e-t-al
                </h1>
                <p className={styles.sidebar__subtitle}>Sre dashboard</p>
            </div>
            <nav className={styles.sidebar__nav}>
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link 
                            key={item.href}
                            href={item.href}
                            className={itemClass}
                        >
                            <span className={styles.sidebar__letter}>
                                {item.letter}
                            </span>
                        {item.label}
                        </Link>
                    );
                })}
            </nav>
            <div className={styles.sidebar__footer}>
                v0.1.0
            </div>
        </aside>
    );
}