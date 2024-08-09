import type { Meta, StoryObj } from '@storybook/react';
import Footer from '@ui/Footer';

const meta: Meta<typeof Footer> = {
  title: 'Components/Footer',
  component: Footer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = (args) => <Footer {...args} />;

export const Default: Story = Template.bind({});
Default.args = {};
