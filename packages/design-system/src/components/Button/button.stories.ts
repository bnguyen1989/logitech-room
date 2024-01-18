import type { Meta, StoryObj } from '@storybook/react';

import Button, { BUTTON_TYPES } from './index.js';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const button = {
  title: 'Button',
  component: Button,
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
} satisfies Meta<typeof Button>;

export default button;
type Story = StoryObj<typeof button>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    children: 'Click me'
  }
};

export const Primary: Story = {
  args: {
    children: 'Click me',
    type: BUTTON_TYPES.primary
  }
};

export const Disabled: Story = {
  args: {
    children: 'Click me',
    type: BUTTON_TYPES.disabled
  }
};
