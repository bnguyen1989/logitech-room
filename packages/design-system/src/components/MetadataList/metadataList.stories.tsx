import type { Meta, StoryObj } from '@storybook/react';

import Metadata, { MetadataTypes } from './index.js';
const sampleData = [
  {
    type: MetadataTypes.STRING,
    name: 'alice',
    value: 'bob'
  },
  {
    type: MetadataTypes.STRING,
    name: 'hello',
    value: 'world'
  },
  {
    type: MetadataTypes.NUMBER,
    name: 'number',
    value: 5
  },
  {
    type: MetadataTypes.STRING,
    name: 'test',
    value: 'bob'
  },
  {
    type: MetadataTypes.STRING,
    name: 'hobbes',
    value: 'world'
  },
  {
    type: MetadataTypes.NUMBER,
    name: 'spice',
    value: 5
  }
];

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const metadata = {
  title: 'Metadata List',
  component: Metadata,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    setMetadata: { action: 'set-metadata' }
  }
} satisfies Meta<typeof Metadata>;

export default metadata;
type Story = StoryObj<typeof metadata>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    metadata: sampleData
  }
};
