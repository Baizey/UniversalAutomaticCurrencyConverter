import * as React from 'react';
import { Meta, Story } from '@storybook/react';
import { Input } from '../../components/atoms';
import { InputProps } from '../../components/atoms/Input';

export default {
  title: 'atoms/Input',
  component: Input,
} as Meta;

const InputTemplate: Story = (args) => <Input {...(args as InputProps)} />;

export const input = InputTemplate.bind({
  onChange: () => {},
});
input.args = {
  center: true,
  placeholder: 'placeholder',
  defaultValue: '',
  type: 'text',
} as InputProps;
