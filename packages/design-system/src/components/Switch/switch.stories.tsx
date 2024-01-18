import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import Switch from './index.js';

const Template = () => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  return <Switch value={isSwitchOn} onChange={setIsSwitchOn} />;
};

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const switchComponent = {
  title: 'Switch',
  component: Template,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    onChange: { control: 'onChange' }
  }
} satisfies Meta<typeof Template>;

export default switchComponent;
type Story = StoryObj<typeof switchComponent>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    value: true
  }
};
