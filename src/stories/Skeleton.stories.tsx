import type { Meta, StoryObj } from '@storybook/react'; 
import Skeleton from '@/components/shared/Skeleton';


const meta: Meta<typeof Skeleton> = {
    title: 'Shared/Skeleton',
    component: Skeleton,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs'],
};

export default meta; 
type Story = StoryObj<typeof Skeleton>;

export const TextLine: Story = {
    args: { className: 'h-4 w-48' },
}

export const TextBlock: Story = {
    render: () => (
        <div className="flex flex-col gap-2 w-64">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
        </div>
    ),
}

export const Card: Story = {
    args: { className: 'h-32 w-64 rounded-lg'}
};

export const Circle: Story = {
    args: { className: 'h-12 w-12 rounded-full'}
}

export const DashboardPanel: Story = {
    render: () => (
        <div className="w-80 p-4 bg-zinc-900 border-zinc-800 rounded-lg flex flex-col gap-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-40 w-full rounded-lg" />
            <div className="flex gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
            </div>
        </div>
    )
}