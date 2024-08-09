// src/Panel.stories.tsx
import type { Meta, Story } from '@storybook/react';
import Panel from '@ui/Panel';
import PanelItem from '@ui/PanelItem';

const meta: Meta<typeof Panel> = {
  title: 'Components/Panel/List',
  component: Panel,
  tags: ['autodocs'], // Add this line to enable autodocs
  parameters: {
    docs: {
      description: {
        component: 'A component for displaying a panel with items.',
      },
    },
  },
};

export default meta;

const Template: Story<typeof Panel> = (args) => (
  <Panel {...args}>
    <PanelItem name="John Doe" username="johndoe" src="" initials="JD" />
    <PanelItem name="John Doe" username="johndoe" src="" initials="JD" />
  </Panel>
);

export const Default = Template.bind({});
Default.args = {
  title: 'Title',
  href: '/',
};
