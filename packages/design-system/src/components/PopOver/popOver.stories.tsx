import type { Meta, StoryObj } from '@storybook/react';

import PopOver from './index.js';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const popOver = {
  title: 'PopOver',
  component: PopOver,
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
} satisfies Meta<typeof PopOver>;

export default popOver;
type Story = StoryObj<typeof popOver>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    children: <button>Click me</button>,
    content: <div>Hello Mars</div>
  }
};
