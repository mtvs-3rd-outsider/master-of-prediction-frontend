// src/TierBadge.stories.tsx
import React from 'react';
import { Meta, Story } from '@storybook/react';
import TierBadge from './TierBadge';

export default {
  title: 'Components/TierBadge',
  component: TierBadge,
} as Meta;

const Template: Story<{ name: string }> = (args) => <TierBadge {...args} />;

export const Nostradamus = Template.bind({});
Nostradamus.args = {
  name: 'nostradamus',
};

export const Novice = Template.bind({});
Novice.args = {
  name: 'novice',
};

export const Oracle = Template.bind({});
Oracle.args = {
  name: 'oracle',
};

export const Prophet = Template.bind({});
Prophet.args = {
  name: 'prophet',
};

export const Seer = Template.bind({});
Seer.args = {
  name: 'seer',
};

export const Unknown = Template.bind({});
Unknown.args = {
  name: 'unknown',
};
