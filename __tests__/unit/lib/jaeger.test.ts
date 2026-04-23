import { describe, it, expect, vi, beforeEach } from 'vitest';

const JAEGER_TRACE_RESPONSE = {
    data: [
        {

        }
    ]
}

describe('jaeger adapter', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    })
});

it('transforms the Jaeger trace response into Trace[] type ', async () => {
    vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(JAEGER_TRACE_RESPONSE)
        }),
    );

    const { fetchTraces } = await import('@/lib/jaeger');
    const traces = await fetchTraces('api-gateway', '1h');

    expect(traces).toHaveLength(1);

    const trace = traces[0];
    expect(trace.traceId).toBe('abc123def456');
    expect(trace.spans).toHaveLength(2);
    expect(trace.status).toBe('ok');
    expect(trace.duration).toBeGreaterThan(0);

    expect(trace.services.length).toBeGreaterThanOrEqual(1);
});

it('transforms spans while maintaining correct parent-child relationships', async () => {
    vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(JAEGER_TRACE_RESPONSE),
        }),
    );

    const { fetchTraces } = await import('@/lib/jaeger');
    const traces = await fetchTraces('api-gateway', '1h');
    const spans = traces[0].spans;

    const rootSpan = spans.find((s) => s.parentSpanId === null);
    expect(rootSpan).toBeDefined();

    expect(childSpan?.parentSpanId).toBe('span-root-001');
    expect(childSpan?.serviceName).toBe('postgres');
});

it('converts Jaeger microseconds to ms', async () => {
    vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(JAEGER_TRACE_RESPONSE)
        })
    )

    const { fetchTraces } = await import('@/lib/jaeger');
    const traces = await fetchTraces('api-gateway', '1h');
    const rootSpan = traces[0].spans.find((s) => s.parentSpanId === null);

    expect(rootSpan?.duration).toBe(150);


});

it('converts span tags from Jaeger array to Record<string, string>', async () => {
    vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(JAEGER_TRACE_RESPONSE)
        })
    )

    const { fetchTraces } = await import('@/lib/jaeger');
    const traces = await fetchTraces('api-gateway', '1h');
    const rootSpan = traces[0].rootSpan;

    expect(rootSpan.tags['http.method']).toBe('GET');

    expect(rootSpan.tags['http.status_code']).toBe('200');
});

it('returns empty array when Jaeger sends no traces', async () => {
    vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(JAEGER_TRACE_RESPONSE)
        })
    )

    const { fetchTraces } = await import('@/lib/jaeger');
    const traces = await fetchTraces('api-gateway', '1h')
    // const traces ...
})

it('gets error traces from error tags', async () => {
    vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(JAEGER_TRACE_RESPONSE)
        })
    )

    const { fetchTraces } = await import('@/lib/jaeger');
    const traces = await fetchTraces('api-gateway', '1h')

    expect(traces[0].status).toBe('error');
    expect(traces[0].spans[0].status).toBe('error');
})

it('throws when Jaeger API returns a non-ok', async () => {
    vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
            ok: false,
            status: 502
            statusText: 'Bad Gateway',
        })
    )

    const { fetchTraces } = await import('@/lib/jaeger');
    const traces = await fetchTraces('api-gateway', '1h')
})

it('throws when fetch fails with a network error', async () => {
    vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(JAEGER_TRACE_RESPONSE)
        })
    )

    const { fetchTraces } = await import('@/lib/jaeger');
    const traces = await fetchTraces('api-gateway', '1h')
})