import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import SaveBar, { Status } from './index.js';

const Template = ({
  onSave,
  status
}: {
  onSave: () => void;
  status: Status;
}) => {
  const [isAutoSaveOn, setIsAutoSaveOn] = useState(false);
  return (
    <SaveBar
      status={status}
      onSave={onSave}
      isSavedDisabled={false}
      isAutoSaveOn={isAutoSaveOn}
      setIsAutoSaveOn={setIsAutoSaveOn}
    />
  );
};

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const saveBar = {
  title: 'SaveBar',
  component: Template,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    onSave: { control: 'onClick' }
  }
} satisfies Meta<typeof Template>;

export default saveBar;
type Story = StoryObj<typeof saveBar>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Saved: Story = {
  args: {
    status: Status.SAVED
  }
};

export const Unsaved: Story = {
  args: {
    status: Status.UNSAVED
  }
};

export const Saving: Story = {
  args: {
    status: Status.SAVING
  }
};
