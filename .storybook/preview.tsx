import type { Preview } from '@storybook/nextjs-vite'
// import { a11yAddon } from '@storybook/addon-a11y/preview'
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {name: 'dark', value: '#0a0a0a' },
        { name: 'zinc-900', value: '#19191b' },
        { name: 'light', value: '#ffffff' },
      ],
    },
    layout: 'padded',
  },
};

export default preview;