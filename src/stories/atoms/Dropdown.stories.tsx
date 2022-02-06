import * as React from 'react';
import { Meta, Story } from '@storybook/react';
import { Dropdown } from '../../components/atoms';
import { DropdownProps } from '../../components/atoms/Dropdown';

export default {
  title: 'atoms/Dropdown',
  component: Dropdown,
} as Meta;

const Template: Story = (args) => <Dropdown {...(args as DropdownProps)} />;

const options = [
  'Abe',
  'Bed',
  'Can',
  'Ded',
  'Ed',
  'Feet',
  'Git',
  'Hit',
  'Jit',
  'Yeet',
];

export const dropdown = Template.bind({
  options: options.map((e) => ({ label: e, value: e })),
  value: options[0],
  onChange: () => {},
});

dropdown.args = {
  maxOptions: 8,
  options: options.map((e) => ({ label: e, value: e })),
  value: options[0],
  onChange: () => {},
} as DropdownProps;
