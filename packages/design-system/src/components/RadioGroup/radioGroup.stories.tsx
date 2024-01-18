import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import RadioGroup from './index.js';

const sampleData = [
  {
    label: 'hello',
    value: 1
  },
  {
    label: 'mars',
    value: 2
  },
  {
    label: 'alice',
    value: 3
  },
  {
    label: 'bob asdasd asdas ',
    value: 4
  }
];

const Template = () => {
  const [value, setValue] = useState<string | number>(3);

  return (
    <RadioGroup
      value={value}
      values={sampleData}
      onChange={(val) => setValue(val)}
    />
  );
};

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const radioGroup = {
  title: 'RadioGroup',
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

export default radioGroup;
type Story = StoryObj<typeof radioGroup>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {}
};
