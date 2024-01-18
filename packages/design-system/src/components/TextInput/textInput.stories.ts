import type { Meta, StoryObj } from '@storybook/react';

import TextInput from './index.js';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const textInput = {
  title: 'TextInput',
  component: TextInput,
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
} satisfies Meta<typeof TextInput>;

export default textInput;
type Story = StoryObj<typeof textInput>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    placeholder: 'Enter some text',
    dataId: 'storybook-text_input',
    value: '',
    onChange: (val) => console.log(val)
  }
};
