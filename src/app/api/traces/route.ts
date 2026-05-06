import { fetchTraces } from '@/lib/jaeger';

function parseParam(
    searchParams: URLSearchParams,
    key: string,
    fallback: string,
): string {
    const value = searchParams.get(key);
    return value && value.trim().length > 0 ? value.trim() : fallback;
}

export async function GET(request: Request) {
    const url = new URL(request.url);
    const service = parseParam(url.searchParams, 'service', 'metal-sre-dashboard');
    const lookback = parseParam(url.searchParams, 'lookback', '1h');

    try {
        const traces = await fetchTraces(service, lookback);

        return Response.json(traces, {
            headers: {
                'Cache-Control': 'no-store',
            },
        });
    } catch (error: unknown) {
        const message = error instanceof Error
            ? error.message
            : 'Failed to fetch traces from Jaeger';
        
        return Response.json(
            { error: message },
            {
                status: 502,
                headers: {
                    'Cache-Control': 'no-store',
                },
            },
        );
    }
}