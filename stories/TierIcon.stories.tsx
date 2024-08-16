import type { Meta, StoryObj } from '@storybook/react';
import TierIcon from '@components/TierIcon';

const meta: Meta<typeof TierIcon> = {
  title: 'Components/TierIcon',
  component: TierIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: {
        type: 'select',
        options: ['apprentice', 'nostradamus', 'novice', 'oracle', 'prophet', 'seer'],
      },
    },

  },
} satisfies Meta<typeof TierIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Apprentice: Story = {
  args: {
    name: 'apprentice',
    size: 48,
  },
};

export const Nostradamus: Story = {
  args: {
    name: 'nostradamus',
    size: 48,
  },
};

export const Novice: Story = {
  args: {
    name: 'novice',
    size: 48,
  },
};

export const Oracle: Story = {
  args: {
    name: 'oracle',
    size: 48,
  },
};

export const Prophet: Story = {
  args: {
    name: 'prophet',
    size: 48,
  },
};

export const Seer: Story = {
  args: {
    name: 'seer',
    size: 48,
  },
};
