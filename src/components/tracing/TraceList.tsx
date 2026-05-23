import { useState } from 'react';
import type { Trace } from '@/types/tracing';
import styles from './TraceList.module.scss';
import Badge from '@/components/shared/Badge';

interface TraceListProps {
    traces: Trace[];
    selectedTraceId: string | null;
    onSelectTrace: (traceId: string) => void;
}

function truncateId(id: string): string {
    return id.length > 12 ? `${id.slice(0, 12)}` : id;
}

function formatDuration(ms: number): string {
    if (ms < 1000)return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}

function TraceRow({
    trace,
    isSelected,
    onSelect,
}: {
    trace: Trace;
    isSelected: boolean;
    onSelect: () => void;
}) {

    const rowClass = `${styles.traceList__row} ${
        isSelected ? styles['traceList__row--selected'] : ''
    }`;

    return (
        <button
            type="button"
            onClick={onSelect}
            className={`${styles.traceList__row} ${isSelected ? styles['tracelList__row--selected'] : ''}`}
        >
            <div className={styles['traceList__row-header']}>
                <span className={styles.traceList__id}>
                    {truncateId(trace.traceId)}
                </span>
                <Badge label={trace.status} variant={trace.status} />
            </div>
            <p className={styles.traceList__operation}>
                {trace.rootSpan.operationName}
            </p>
            <div className={styles.traceList__meta}>
                <span>{formatDuration(trace.duration)}</span>
                <span>{trace.services.length} services</span>
                <span>{trace.spans.length} spans</span>
            </div>
        </button>
    )
}

export default function TraceList({
    traces,
    selectedTraceId,
    onSelectTrace,
}: TraceListProps) {
    const [filter, setFilter] = useState('');

    const filtered = filter 
        ? traces.filter(
                (t) => 
                    t.rootSpan.operationName.toLowerCase().includes(filter.toLowerCase()) ||
                    t.traceId.toLowerCase().includes(filter.toLowerCase()),
            )
        : traces;
    
    return (
        <div className={styles.traceList}>
            <div className={styles['traceList__filter-wrap']}>
                <input 
                    type="text"
                    placeholder="Filter by operation or by trace ID..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className={styles.traceList__filter}
                />
            </div>
            <div className={styles.traceList__rows}>
                {filtered.length === 0 ? (
                    <p className={styles.traceList__empty}>
                        {filter ? 'No traces matching your filter.' : 'No traces available'}
                    </p>
                ) : (
                    filtered.map((trace) => (
                        <TraceRow 
                            key={trace.traceId}
                            trace={trace}
                            isSelected={trace.traceId === selectedTraceId}
                            onSelect={() => onSelectTrace(trace.traceId)}
                        />
                    ))
                )}
            </div>
            <div className={styles.traceList__footer}>
                {filtered.length} of {traces.length} traces
            </div>
        </div>
    );
}