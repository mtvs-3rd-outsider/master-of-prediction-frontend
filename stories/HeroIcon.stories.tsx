// src/HeroIcon.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { HeroIcon } from '@components/HeroIcon';
import * as SolidIcons from '@heroicons/react/24/solid';
import * as OutlineIcons from '@heroicons/react/24/outline';

const meta: Meta<typeof HeroIcon> = {
  title: 'Components/HeroIcon',
  component: HeroIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    iconName: {
      control: {
        type: 'select',
        options: [...Object.keys(SolidIcons), ...Object.keys(OutlineIcons)],
      },
    },
    solid: { control: 'boolean' },
    className: { control: 'text' },
    iconName: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = (args) => <HeroIcon {...args} />;

export const Default: Story = Template.bind({});
Default.args = {
  solid: false,
  iconName: 'BeakerIcon', // Default icon
  className: 'h-6 w-6 text-blue-500',
};

export const Solid: Story = Template.bind({});
Solid.args = {
  solid: true,
  iconName: 'BeakerIcon', // Default icon
  className: 'h-6 w-6 text-blue-500',
};

export const Outline: Story = Template.bind({});
Outline.args = {
  solid: false,
  iconName: 'BeakerIcon', // Default icon
  className: 'h-6 w-6 text-blue-500',
};
