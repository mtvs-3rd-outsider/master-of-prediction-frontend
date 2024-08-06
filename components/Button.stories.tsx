import type { Meta, StoryObj } from '@storybook/react';
import Button from '@ui/Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    intent: {
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary'],
      },
    },
    size: {
      control: {
        type: 'select',
        options: ['small', 'default', 'large'],
      },
    },
    children: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = (args) => <Button {...args} />;

export const Default: Story = Template.bind({});
Default.args = {
  intent: 'primary',
  size: 'default',
  children: 'Submit',
};
