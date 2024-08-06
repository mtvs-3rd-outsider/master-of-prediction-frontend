import type { Meta, StoryObj } from '@storybook/react';
import AccountNavItem from '@ui/AccountNavItem';

const meta: Meta<typeof AccountNavItem> = {
  title: 'Components/AccountNavItem',
  component: AccountNavItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = (args) => <AccountNavItem {...args} />;

export const Default: Story = Template.bind({});
Default.args = {};
