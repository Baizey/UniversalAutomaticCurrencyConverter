import * as React from 'react';
import {Meta, Story} from '@storybook/react';
import {Button, ButtonProps} from '../../components/atoms';

export default {
    title: 'atoms/Button',
    component: Button,
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} >Button</Button>

export const primary = Template.bind({});
export const secondary = Template.bind({});
export const success = Template.bind({});
export const error = Template.bind({});
primary.args = {
    primary: () => {},
    connect: {
        up: false,
        down: false,
        left: false,
        right: false
    }
} as ButtonProps

secondary.args = {
    secondary: () => {},
    connect: {
        up: false,
        down: false,
        left: false,
        right: false
    }
}
success.args = {
    success: () => {},
    connect: {
        up: false,
        down: false,
        left: false,
        right: false
    }
}
error.args = {
    error: () => {},
    connect: {
        up: false,
        down: false,
        left: false,
        right: false
    }
}