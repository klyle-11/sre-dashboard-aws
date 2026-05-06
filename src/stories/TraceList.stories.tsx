import type { Meta, StoryObj } from '@storybook/react';
import TraceList from '@/components/tracing/TraceList';
import type { Trace, Span } from '@/types/tracing';

function makeSpan(overrides: Partial<Span> = {}): Span {
    return {
        spanId: 'span-abc243',
        parentSpanId: null,
        traceId: 'trace-001',
        operationName: 'GET /api/users',
        startTime: 0,
        duration: 120,
        status: 'ok',
        tags: {
            'service.name': 'api-gateway', 'http:status': '200'
        }, ...overrides,
    };
}

function makeTrace(overrides: Partial<Trace> = {}): Trace {
    const rootSpan = makeSpan(overrides.rootSpan);
    return {
        traceId: 'trace-001',
        rootSpan,
        spans: [rootSpan],
        duration: 120,
        services: ['api-gateway'],
        status: 'ok',
        timestamp: new Date().toISOString(),
        correlationId: 'corr-xyz',
        ...overrides,
    };
}

const sampleTraces: Trace[] = [
    makeTrace({
        traceId: 'trace-001',
        rootSpan: makeSpan({ operationName: 'GET /api/users', duration: 120 }),
        duration: 120,
        services: ['api-gateway', 'user-service', 'postgres'],
        status: 'ok',
    }),
    makeTrace({
        traceId: 'trace-002',
        rootSpan: makeSpan({ 
            traceId: 'trace-002',
            operationName: 'GET /api/users', 
            duration: 120 ,
            status: 'error',
        }),
        duration: 340,
        services: ['api-gateway', 'auth-service'],
        status: 'error',
    }),
    makeTrace({
        traceId: 'trace-003',
        rootSpan: makeSpan({ 
            traceId: 'trace-003',
            operationName: 'GET /api/search', 
            duration: 890 ,
        }),
        duration: 890,
        services: ['api-gateway', 'search-service', 'cache', 'postgres'],
        status: 'ok',
    }),
    makeTrace({
        traceId: 'trace-004',
        rootSpan: makeSpan({ 
            traceId: 'trace-004',
            operationName: 'GET /api/billing', 
            duration: 1200,
        }),
        duration: 1200,
        services: ['api-gateway', 'billing-service', 'postgres'],
        status: 'ok',
    }),
    makeTrace({
        traceId: 'trace-005',
        rootSpan: makeSpan({ 
            traceId: 'trace-005',
            operationName: 'GET /api/profile', 
            duration: 65,
            status: 'error',
        }),
        duration: 65,
        services: ['api-gateway', 'user-service'],
        status: 'error',
    }),
]

const meta: Meta<typeof TraceList> = {
    title: 'Tracing/TraceList',
    component: TraceList,
    parameters: {
        layout: 'padded'
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div style={{ height: 500, width: 360 }}>
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof TraceList>;

export const Default: Story = {
    args: {
        traces: sampleTraces,
        selectedTraceId: null,
        onSelectTrace: () => {},
    }
};

export const WithSelection: Story = {
    args: {
        traces: sampleTraces,
        selectedTraceId: 'trace-002',
        onSelectTrace: () => {},
    }
};

export const Empty: Story = {
    args: {
        traces: [],
        selectedTraceId: null,
        onSelectTrace: () => {},
    }
};

export const SingleTrace: Story = {
    args: {
        traces: [sampleTraces[0]],
        selectedTraceId: null,
        onSelectTrace: () => {},
    }
};