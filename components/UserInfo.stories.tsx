import type { Meta, StoryObj } from '@storybook/react';
import UserInfo from '@ui/UserInfo';

const meta: Meta<typeof UserInfo> = {
  title: 'Components/UserInfo',
  component: UserInfo,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    name: { control: 'text' },
    username: { control: 'text' },
    date: { control: 'text' },
    tierName: {
      control: {
        type: 'select',
        options: ['novice', 'nostradamus', 'oracle', 'prophet', 'seer'], // 필요한 티어 이름을 추가
      },
    },
    tierLabel: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = (args) => <UserInfo {...args} />;

export const Default: Story = Template.bind({});
Default.args = {
  name: 'John Doe',
  username: 'johndoe',
  date: '2023-01-01',
  tierName: 'novice',
  tierLabel: '견습생',
};
