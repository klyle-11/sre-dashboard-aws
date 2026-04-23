import type { Preview } from '@storybook/nextjs-vite'
import { a11yAddon } from '@storybook/addon-a11y/preview'

const preview: Preview = {
  addons: [a11yAddon()],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;