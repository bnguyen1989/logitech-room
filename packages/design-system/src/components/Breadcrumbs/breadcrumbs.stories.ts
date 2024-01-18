import type { Meta, StoryObj } from '@storybook/react';

import Breadcrumbs from './index.js';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const breadcrumbs = {
  title: 'Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs']
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  //   argTypes: {
  //     backgroundColor: { control: 'color' },
  //   },
} satisfies Meta<typeof Breadcrumbs>;

export default breadcrumbs;
type Story = StoryObj<typeof breadcrumbs>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    path: [
      {
        label: 'Items',
        url: ''
      },
      {
        label: 'All',
        url: ''
      }
    ]
  }
};
