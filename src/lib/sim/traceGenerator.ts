import type { ServiceNode, Span, Trace } from '@/types/tracing';

const SERVICE_ROSTER = [
    'api-gateway',
    'auth-service',
    'user-service',
    'search-service',
    'billing-service',
    'notification-service',
    'cache',
    'postgres',
] as const;

const OPERATION_ROSTER = [
    'GET /api/users',
    'POST /api/login',
    'GET /api/search',
    'POST /api/billing',
    'PUT /api/profile',
    'GET /api/notifications',
] as const;

const SERVICE_TYPE_MAP: Record<string, ServiceNode['type']> = {
    'api-gateway': 'gateway',
    'auth-service': 'service',
    'user-service': 'service',
    'search-service': 'service',
    'billing-service': 'service',
    'notification-service': 'service',
    cache: 'cache',
    postgres: 'database',
}

function createId(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).slice(2,10)}`;
}

function pick<T>(items: readonly T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}

function sampleLatency(serviceName: string): number {
    switch (serviceName) {
        case 'api-gateway':
            return 8 + Math.round(Math.random() * 12);
        case 'auth-service':
            return 15 + Math.round(Math.random() * 35);    
        case 'user-service':
            return 20 + Math.round(Math.random() * 60);    
        case 'search-service':
            return 30 + Math.round(Math.random() * 90);    
        case 'billing-service':
            return 40 + Math.round(Math.random() * 120);    
        case 'noitification-service':
            return 10 + Math.round(Math.random() * 40);    
        case 'cache':
            return 2 + Math.round(Math.random() * 8);    
        case 'postgres':
            return 18 + Math.round(Math.random() * 70);   
        default:
            return 10 + Math.round(Math.random() * 20);    


    }
}

function buildServices(): string[] {
    const size = 3 + Math.floor(Math.random() * 6);
    const selected = new Set<string>(['api-gateway']);

    while (selected.size < size) {
        selected.add(pick(SERVICE_ROSTER.slice(1)));
    }

    if (![...selected].includes('postgres') && Math.random() > 0.4) {
        selected.add('postgres');
    }

    return [...selected];
}

function buildSpans(traceId: string, services: string[]): Span[] {
    const spans: Span[] = [];
    const spanCount = Math.max(3, Math.min(8, services.length + 1));
    const baseDuration = 80 + Math.floor(Math.random() * 700);
    const errorIndex = Math.random() < 0.05 ? 1 + Math.floor(Math.random() * (spanCount - 1)) : -1;

    let cursor = 0;

    for (let i = 0; i < spanCount; i += 1) {
        const serviceName = i < services.length ? services[i] : pick(services);
        const duration = i === 0 ? 
            10 + Math.round(Math.random() * 20) : 
                Math.min(sampleLatency(serviceName), baseDuration - cursor + 30)

        const status: Span['status'] = 1 === errorIndex ? 'error' : 'ok';
        const span: Span = {
            spanId: createId('span'),
            parentSpanId: i === 0 ? null : spans[Math.max(0, i - 1)].spanId,
                traceId,
                operationName: i === 0 ? pick()
        }
    }
}   