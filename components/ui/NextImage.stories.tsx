// src/NextImage.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { NextImage } from './NextImage';

const meta: Meta<typeof NextImage> = {
  title: 'Components/NextImage',
  component: NextImage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
    width: { control: 'text' },
    height: { control: 'text' },
    useSkeleton: { control: 'boolean' },
    imgClassName: { control: 'text' },
    previewCount: { control: 'number' },
    blurClassName: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = (args) => <NextImage {...args} />;

export const Default: Story = Template.bind({});
Default.args = {
  src: 'https://via.placeholder.com/150',
  alt: 'Placeholder Image',
  width: '150',
  height: '150',
  useSkeleton: true,
  imgClassName: '',
  previewCount: 1,
  blurClassName: '',
};

export const WithSkeleton: Story = Template.bind({});
WithSkeleton.args = {
  src: 'https://via.placeholder.com/300',
  alt: 'Placeholder Image',
  width: '300',
  height: '300',
  useSkeleton: true,
  imgClassName: 'rounded-full',
  previewCount: 2,
  blurClassName: 'bg-gray-200',
};
