import type { Meta, StoryObj } from '@storybook/react';
import Avatar from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: '프로필 이미지의 URL',
    },
    alt: {
      control: 'text',
      description: '이미지의 대체 텍스트',
    },
    initials: {
      control: 'text',
      description: '이미지가 없을 때 표시될 이니셜',
    },
    size: {
      control: 'radio',
      options: ['tiny', 'small', 'medium', 'large', 'huge'],
      description: '아바타의 크기 (디자인 토큰 사용)',
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = (args) => <Avatar {...args} />;

export const Default: Story = Template.bind({});
Default.args = {
  src: 'https://pbs.twimg.com/profile_images/1489998205236527108/q2REh8nW_400x400.jpg',
  alt: 'Roy Quilor',
  initials: 'RQ',
  size: 'medium',
};

export const Tiny: Story = Template.bind({});
Tiny.args = {
  src: 'https://pbs.twimg.com/profile_images/1489998205236527108/q2REh8nW_400x400.jpg',
  alt: 'Roy Quilor',
  initials: 'RQ',
  size: 'tiny',
};

export const Small: Story = Template.bind({});
Small.args = {
  src: 'https://pbs.twimg.com/profile_images/1489998205236527108/q2REh8nW_400x400.jpg',
  alt: 'Roy Quilor',
  initials: 'RQ',
  size: 'small',
};

export const Large: Story = Template.bind({});
Large.args = {
  src: 'https://pbs.twimg.com/profile_images/1489998205236527108/q2REh8nW_400x400.jpg',
  alt: 'Roy Quilor',
  initials: 'RQ',
  size: 'large',
};

export const Huge: Story = Template.bind({});
Huge.args = {
  src: 'https://pbs.twimg.com/profile_images/1489998205236527108/q2REh8nW_400x400.jpg',
  alt: 'Roy Quilor',
  initials: 'RQ',
  size: 'huge',
};
