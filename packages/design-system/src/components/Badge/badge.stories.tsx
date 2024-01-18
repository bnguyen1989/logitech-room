import type { Meta, StoryObj } from '@storybook/react';

import Badge from './index.js';

const Template = () => {
  return (
    <Badge label="22">
      <div style={{ height: '60px', width: '60px', background: '#aaa' }}></div>
    </Badge>
  );
};

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const badge = {
  title: 'Badge',
  component: Template,
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
} satisfies Meta<typeof Template>;

export default badge;
type Story = StoryObj<typeof badge>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {}
};
