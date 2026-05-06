import type { Meta, StoryObj } from '@storybook/react';
import Badge from '@/components/shared/Badge';

const meta: Meta<typeof Badge> = {
    title: 'Shared/Badge',
    component: Badge,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Ok: Story = {
    args: { label: 'ok', variant: 'ok', }
};

export const Error: Story = {
    args: { label: 'error', variant: 'error', }
};

export const Warning: Story = {
    args: { label: 'warning', variant: 'warning', }
};

export const Info: Story = {
    args: { label: 'info', variant: 'info', }
};

export const Neutral: Story = {
    args: { label: 'cache', variant: 'neutral', }
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex gap-2">
            <Badge label="ok" variant="ok" />
            <Badge label="error" variant="error" />
            <Badge label="warning" variant="warning" />
            <Badge label="info" variant="info" />
            <Badge label="cache" variant="neutral" />
        </div>
    ),
};