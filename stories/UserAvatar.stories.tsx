// src/UserAvatar.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { UserAvatar } from '@components/user/UserAvatar';

const meta: Meta<typeof UserAvatar> = {
  title: 'Components/UserAvatar',
  component: UserAvatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
    size: { control: 'number' },
    username: { control: 'text' },
    className: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = (args) => <UserAvatar {...args} />;

export const Default: Story = Template.bind({});
Default.args = {
  src: 'https://via.placeholder.com/48',
  alt: 'User Avatar',
  size: 48,
  username: 'john_doe',
  className: '',
};

export const WithoutUsername: Story = Template.bind({});
WithoutUsername.args = {
  src: 'https://via.placeholder.com/48',
  alt: 'User Avatar',
  size: 48,
  username: '',
  className: '',
};
