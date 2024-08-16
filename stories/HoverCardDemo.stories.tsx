// src/HoverCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import HoverCard, { Props } from '@components/radix/HoverCard';

const meta: Meta<typeof HoverCard> = {
  title: 'Components/HoverCard',
  component: HoverCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
    initials: { control: 'text' },
    name: { control: 'text' },
    username: { control: 'text' },
    description: { control: 'text' },
    following: { control: 'text' },
    followers: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = (args) => <HoverCard {...args} />;

export const Default: Story = Template.bind({});
Default.args = {
  src: 'https://via.placeholder.com/150',
  alt: 'User Avatar',
  initials: 'JD',
  name: 'John Doe',
  username: '@johndoe',
  description: 'Software Engineer at Example Inc.',
  following: '100',
  followers: '200',
};
