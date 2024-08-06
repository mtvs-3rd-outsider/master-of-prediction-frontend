// src/TierBadge.stories.tsx
import type { Meta, Story } from '@storybook/react';
import TierBadge from './TierBadge';

const meta: Meta<typeof TierBadge> = {
  title: 'Components/TierBadge',
  component: TierBadge,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: ['nostradamus', 'novice', 'oracle', 'prophet', 'seer'], // 사전에 정의한 등급을 옵션으로 추가합니다.
    },
  },
};

export default meta;

const Template: Story<typeof TierBadge> = (args) => <TierBadge {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'nostradamus'
};
