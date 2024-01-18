import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import Slider from './index.js';

const Template = () => {
  const [value, setValue] = useState(22);
  return (
    <div style={{ width: '320px' }}>
      <Slider value={value} onChange={setValue} />
    </div>
  );
};

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const slider = {
  title: 'Slider',
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

export default slider;
type Story = StoryObj<typeof slider>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    value: 22
  }
};
