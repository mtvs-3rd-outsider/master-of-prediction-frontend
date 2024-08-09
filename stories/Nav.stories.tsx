import type { Meta, StoryObj } from '@storybook/react';
import Nav from '@ui/Nav';

const meta: Meta<typeof Nav> = {
  title: 'Components/Nav/List',
  component: Nav,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = (args) => <Nav {...args} />;

export const Default: Story = Template.bind({});
Default.args = {};
