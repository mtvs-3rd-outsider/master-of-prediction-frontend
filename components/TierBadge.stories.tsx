import type { Meta, StoryObj } from '@storybook/react';
import TierBadge from '@ui/TierBadge';

const meta: Meta<typeof TierBadge> = {
  title: 'Components/TierBadge',
  component: TierBadge,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    name: {
      control: {
        type: 'select',
        options: ['nostradamus', 'novice', 'oracle', 'prophet', 'seer'], // 필요한 티어 이름을 추가
      },
    },
    label: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = (args) => <TierBadge {...args} />;

export const Default: Story = Template.bind({});
Default.args = {
  name: 'nostradamus',
  label: '노스트라다무스',
};
