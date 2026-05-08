'use client';

import { useState } from 'react';
import TraceList from '@/components/tracing/TraceList';
import TraceWaterfall from '@/components/tracing/TraceWaterfall';
import ServiceMap from '@/components/tracing/ServiceMap';
import { useTraces } from '@/hooks/useTraces';
import styles from './tracing.module.scss';

export default function TracingPage() {
    const { traces, serviceMap, isLoading, isSimData, error } = useTraces();
    const [selectedTraceId, setSelectedTraceId] = useState<string | null>(null);

    const selectedTrace = traces.find((t) => t.traceId === selectedTraceId) ?? null;

    return (
        <div className="page-container">
            <div className={styles.header}>
                <h2 className={styles.title}>Dist. tracing</h2>
            </div>

            {isSimData && (
                <div className={styles.simBanner}>
                    Live data unavailable, showing sim data. Start Jaeger with {' '}
                    <code className={styles.code}>
                        docker compose up
                    </code>{' '}
                </div>
            )}

            {error && !isSimData && (
                <div className={styles.simError}>
                    Failed to load trace data. Check your network connection?
                </div>
            )}

            <ServiceMap serviceNodes={serviceMap} />
            <div className={styles.grid}>
                <div className={styles.colList}>
                    <TraceList 
                        traces={traces}
                        selectedTraceId={selectedTraceId}
                        onSelectTrace={setSelectedTraceId}
                    />
                </div>
                <div className={styles.colWaterfall}>
                    <TraceWaterfall trace={selectedTrace} />
                </div>
            </div>
        </div>
    );
}