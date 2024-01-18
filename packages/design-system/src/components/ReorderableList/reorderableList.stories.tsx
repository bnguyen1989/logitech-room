import type { Meta, StoryObj } from '@storybook/react';
import { styled } from 'styled-components';

import ReorderableList from './index.js';

const Wrapper = styled.div<{ selected?: boolean }>`
  padding: 8px 12px;
  margin-bottom: 3px;
  border: 1px solid #555;
  border-radius: 3px;
  width: 320px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;

  background: ${(props) => (props.selected ? 'lightblue' : '#fff')};

  &:hover {
    background: ${(props) =>
      props.selected == null ? '#eee' : props.selected ? 'lightblue' : '#fff'};
  }
`;

const Template = () => {
  return (
    <ReorderableList>
      <Wrapper>Item 1</Wrapper>
      <Wrapper>Item 2</Wrapper>
      <Wrapper>Item 3</Wrapper>
      <Wrapper>Item 4</Wrapper>
    </ReorderableList>
  );
};

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const reorderableList = {
  title: 'ReorderableList',
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

export default reorderableList;
type Story = StoryObj<typeof reorderableList>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {}
};
