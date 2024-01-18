import type { Meta, StoryObj } from '@storybook/react';
import { styled } from 'styled-components';

// Icons
import Player2DIcon from './2D.js';
import Player3DIcon from './3D.js';
import AddIcon from './Add.js';
import ArIcon from './AR.js';
import CaretDownIcon from './CaretDown.js';
import CaretLeftIcon from './CaretLeft.js';
import CaretRightIcon from './CaretRight.js';
import CaretUpIcon from './CaretUp.js';
import DeleteIcon from './Delete.js';
import DragIcon from './Drag.js';
import FullscreenIcon from './Fullscreen.js';
import ImageIcon from './Image.js';
import InfoIcon from './Info.js';
import ShareIcon from './Share.js';
import SpinnerIcon from './Spinner.js';
import ThreekitLogoIcon from './ThreekitLogo.js';

const icons = {
  Player2DIcon,
  Player3DIcon,
  AddIcon,
  ArIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretUpIcon,
  DeleteIcon,
  DragIcon,
  FullscreenIcon,
  ImageIcon,
  InfoIcon,
  ShareIcon,
  SpinnerIcon,
  ThreekitLogoIcon
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  & > div {
    border-radius: 2px;
    border: 1px solid lightgrey;
    margin-right: 5px;
    margin-bottom: 5px;
    padding: 10px 0;

    min-height: 60px;
    min-width: 90px;
    width: 90px;

    & > div {
      text-align: center;
    }

    & > div:nth-child(1) {
      margin-bottom: 12px;
      /* font-size: 20px; */
    }

    & > div:nth-child(2) {
      text-transform: capitalize;
    }
  }
`;

const IconGrid = () => {
  return (
    <Wrapper>
      {Object.values(icons).map((Icon, i) => (
        <div key={i}>
          <div>
            <Icon />
          </div>
          <div>{Icon.iconName}</div>
        </div>
      ))}
    </Wrapper>
  );
};

const iconsGrid = {
  title: 'Icons',
  component: IconGrid,
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
} satisfies Meta<typeof IconGrid>;

export default iconsGrid;
type Story = StoryObj<typeof iconsGrid>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    label: 'Click me'
  }
};
