import type { Meta, StoryObj } from '@storybook/react';

import Accordion from './index.js';

const { AccordionItem } = Accordion;

const Template = () => {
  return (
    <div style={{ width: '600px' }}>
      <Accordion>
        <AccordionItem label="First Accordion">Hello World</AccordionItem>
        <AccordionItem label="Second one">Hello Mars</AccordionItem>
      </Accordion>
    </div>
  );
};

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const accordion = {
  title: 'Accordion',
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

export default accordion;
type Story = StoryObj<typeof accordion>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {}
};
