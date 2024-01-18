import type { Meta, StoryObj } from '@storybook/react';

import Tabs from './index.js';
const { TabPane } = Tabs;

const items = [
  {
    label: 'First Section',
    content: 'This is some content in the first section'
  },
  {
    label: 'Second Section',
    content: 'This is different content for a different section'
  }
];

const Template = (args: any) => {
  return (
    <div style={{ width: '600px' }}>
      <Tabs {...args}>
        {items.map((el, i) => (
          <TabPane key={i} label={el.label}>
            {el.content}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const tabs = {
  title: 'Tabs',
  component: Template,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs']
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  // argTypes: {
  //   onChange: { action: 'select-tab' }
  // }
} satisfies Meta<typeof Template>;

export default tabs;
type Story = StoryObj<typeof tabs>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {}
};
