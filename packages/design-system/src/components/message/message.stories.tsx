import type { Meta, StoryObj } from '@storybook/react';

import message from './index.js';

const MessageComponent = () => {
  return (
    <button onClick={() => message.info('hello mars')}>Try Message</button>
  );
};

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const messageStory = {
  title: 'MessageComponent',
  component: MessageComponent,
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
} satisfies Meta<typeof MessageComponent>;

export default messageStory;
type Story = StoryObj<typeof messageStory>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {}
};
