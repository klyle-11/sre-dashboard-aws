import type { Meta, StoryObj } from '@storybook/react';
import ServiceMap from '@/components/tracing/ServiceMap';
import type { ServiceNode } from '@/types/tracing';

const sampleNodes: ServiceNode[] = [
    {
        name: 'api-gateway',
        type: 'gateway',
        requestRate: 42,
        errorRate: 0.3,
        avgLatency: 12.4,
        connections: [
            { target: 'auth-service', requestRate: 8 },
            { target: 'user-service', requestRate: 6 },
        ]
    },
    {
        name: 'auth-service',
        type: 'service',
        requestRate: 28,
        errorRate: 1.2,
        avgLatency: 34.0,
        connections: [
            { target: 'cache', requestRate: 10 }
        ]
    },
    {
        name: 'user-service',
        type: 'service',
        requestRate: 22,
        errorRate: 0.0,
        avgLatency: 45.6,
        connections: [
            { target: 'postgres', requestRate: 18 }
        ]
    },
    {
        name: 'cache',
        type: 'cache',
        requestRate: 38,
        errorRate: 0.0,
        avgLatency: 3.2,
        connections: [],
    },
    {
        name: 'postgres',
        type: 'database',
        requestRate: 30,
        errorRate: 0.5,
        avgLatency: 28.7,
        connections: []
    },
];

const errorHeavyNodes: ServiceNode[] = [
    {
        name: 'api-gateway',
        type: 'gateway',
        requestRate: 42,
        errorRate: 15.0,
        avgLatency: 220.0,
        connections: [
            { target: 'billing-service', requestRate: 12 },
            { target: 'search-service', requestRate: 9 },
        ]
    },
    {
        name: 'billing-service',
        type: 'service',
        requestRate: 18,
        errorRate: 22.5,
        avgLatency: 480.0,
        connections: [
            { target: 'postgres', requestRate: 14 }
        ]
    },
    {
        name: 'search-service',
        type: 'service',
        requestRate: 15,
        errorRate: 8.0,
        avgLatency: 310.0,
        connections: []
    },
    {
        name: 'postgres',
        type: 'database',
        requestRate: 26,
        errorRate: 12.0,
        avgLatency: 150.0,
        connections: [],
    },
];

const meta: Meta<typeof ServiceMap> = {
    title: 'Tracing/ServiceMap',
    component: ServiceMap,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ServiceMap>;

export const Default: Story = {
    args: {
        serviceNodes: sampleNodes,
    }
};

export const ErrorHeavy: Story = {
    args: {
        serviceNodes: errorHeavyNodes,
    },
};

export const Empty: Story = {
    args: {
        serviceNodes: [],
    }
};