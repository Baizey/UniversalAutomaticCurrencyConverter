import * as React from 'react';
import {Meta, Story} from '@storybook/react';
import {StyledInput} from '../../components/atoms';
import {StyledInputProps} from '../../components/atoms/StyledInput';

export default {
    title: 'atoms/Input',
    component: StyledInput,
} as Meta;

const StyledInputTemplate: (Story) = (args) => <StyledInput {...args as StyledInputProps} />

export const input = StyledInputTemplate.bind({onChange: () => {}});
input.args = {
    center: true,
    placeholder: 'placeholder',
    defaultValue: '',
    type: 'text'
} as StyledInputProps