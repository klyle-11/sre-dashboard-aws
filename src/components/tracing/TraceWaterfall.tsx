'use client';

import { useState, useMemo } from 'react';
import type { Span, Trace } from '@/types/tracing';
import styles from './TraceWaterfall.module.scss';

interface TraceWaterfallProps {
    trace: Trace | null;
}

interface FlattenedSpan {
    span: Span;
    depth: number;
}

const KNOWN_SERVICES = new Set(['api-gateway', 'auth-service', 'user-service', 'search-service', 'billing-service', 'notification-service', 'cache', 'postgres']);

function serviceModifier(name: string): string {
    return KNOWN_SERVICES.has(name) ? name: 'default';
}


function flattenSpanTree(spans: Span[]): FlattenedSpan[] {
    const childrenMap = new Map<string | 'root', Span[]>();

    for (const span of spans) {
        const parentKey = span.parentSpanId ?? 'root';
        const siblings = childrenMap.get(parentKey);
        if(siblings) {
            siblings.push(span);
        } else {
            childrenMap.set(parentKey, [span])
        }
    }

    const result: FlattenedSpan[] = [];

    function walk(parentId: string | 'root', depth: number): void {
        const children = childrenMap.get(parentId) ?? [];
        for (const child of children) {
            result.push({ span: child, depth });
            walk(child.spanId, depth + 1)
        }
    }

    walk('root', 0);
    return result;
}

function formatMs(ms: number): string {
    if (ms < 1) return '<1ms';
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}`;
}

function SpanBar({
    entry,
    traceDuration,
    isExpanded,
    onToggle
}: {
    entry: FlattenedSpan;
    traceDuration: number;
    isExpanded: boolean;
    onToggle: () => void;
}) {

    const { span, depth } = entry;
    const leftPercent = traceDuration > 0 ? (span.startTime / traceDuration) * 100 : 0;
    const widthPercent = traceDuration > 0 ? Math.max(0.5, (span.duration / traceDuration) * 100) : 0;
    const isError = span.status === 'error';
    
    const barModifier = isError ? 'error' : serviceModifier(span.serviceName);

    return (
        <div className={styles.waterfall__row}>
            <button
                type="button"
                onClick={onToggle}
                className={`${styles['waterfall__row-button']}`}
            >
                <div className={styles['waterfall__row-content']}>
                    <div
                        className={styles.waterfall__label}
                        style={{ paddingLeft: `${depth * 20}px` }}
                    >
                        <span 
                            className={`${styles.waterfall__indicator} ${styles[`waterfall__indicator-${serviceModifier(span.serviceName)}`]}`}
                        />
                        <span className={styles.waterfall__service}>{span.serviceName}</span>
                        <span className={styles.waterfall__operation}>{span.operationName}</span>
                    </div>
                    <div className={styles['watterfall__bar-track']}>
                        <div 
                            className={`${styles.waterfall__bar} ${styles[`waterfall__bar--${barModifier}`]}`} 
                            style={{
                                left: `${leftPercent}`,
                                width: `${widthPercent}`,
                            }}
                        />
                    </div>
                    <span className={styles.waterfall__duration}>
                        {formatMs(span.duration)}
                    </span>
                </div>
            </button>
            {isExpanded && (
                <div className={styles.waterfall__details}>
                    <div className={styles['waterfall__details-grid']}>
                        <span className={styles['waterfall__detail-key']}>Span ID</span>
                        <span className={`${styles['waterfall__detail-value']} ${styles['waterfall__detail-value--mono']}`}>{span.spanId}</span>
                        <span className={styles['waterfall__detail-key']}>Service</span>
                        <span className={`${styles['waterfall__detail-value']} ${styles['waterfall__detail-value--mono']}`}>{span.serviceName}</span>
                        <span className={styles['waterfall__detail-key']}>Operation</span>
                        <span className={`${styles['waterfall__detail-value']} ${styles['waterfall__detail-value--mono']}`}>{span.operationName}</span>
                        <span className={styles['waterfall__detail-key']}>Duration</span>
                        <span className={`${styles['waterfall__detail-value']} ${styles['waterfall__detail-value--mono']}`}>{formatMs(span.duration)}</span>
                        <span className={styles['waterfall__detail-key']}>Status</span>
                        <span className={isError ? 'text-red-400' : 'text-emerald-400'}>{span.status}</span>
                        {Object.entries(span.tags).map(([key, value]) => (
                            <div key={key} className="contents">
                                <span className={styles['waterfall__detail-key']}>{key}</span>
                                <span className={`${styles['waterfall__detail-value']} ${styles['waterfall__detail-value--mono']}`}>{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function TraceWaterfall({ trace }: TraceWaterfallProps) {

    const [expandedSpanId, setExpandedSpanId] = useState<string | null>(null);

    const flatSpans = useMemo(() => {
        if (!trace) return [];
        return flattenSpanTree(trace.spans);
    }, [trace]);

    if (!trace) {
        <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
            Click a trace from the list to show its waterfall viz
        </div>
    }
    
    return (
        <div className="flex flex-col h-full bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-800">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-zinc-200">
                            {trace?.rootSpan.operationName}
                        </h3>
                        <p className="text-xs text-zinc-500 font-mono mt-0.5">
                            {trace?.traceId}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-400">
                        <span>{formatMs(trace?.duration ?? 0)}</span>
                        <span>{trace?.spans.length} spans</span>
                        <span
                            className={`px-2 py-0.5 rounded-full font-medium ${
                                trace?.status === 'error'
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-emerald-500/20 text-emerald-400'
                            }`}
                        >
                            {trace?.status}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {flatSpans.map((entry) => (
                    <SpanBar 
                        key={entry.span.spanId}
                        entry={entry}
                        traceDuration={trace.duration}
                        isExpanded={entry.span.spanId === expandedSpanId}
                        onToggle={() => 
                            setExpandedSpanId(
                                expandedSpanId === entry.span.spanId ? null : entry.span.spanId,
                            )
                        }
                    />
                ))}
            </div>
        </div>
    );
}