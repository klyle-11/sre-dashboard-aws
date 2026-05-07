'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
        <aside className="">
            <div className="">
                <h1 className="">

                </h1>
                <p className="">Sre dashboard</p>
            </div>
            <nav className="flex-1 py-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link 
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                                isActive
                                    ? 'bg-zinc-800/60 text-zinc-100 border-1-2 border-1-blue-500'
                                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
                            }`}
                        >
                            <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                                isActive
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'bg-zinc-800 text-zinc-500'
                            }`}>
                                {item.letter}
                            </span>
                        {item.label}
                        </Link>
                    );
                })}
            </nav>
            <div className="px-4 py-3 border-t border-zinc-800 text-xs text-zinc-600">
                v0.1.0
            </div>
        </aside>
    );
}