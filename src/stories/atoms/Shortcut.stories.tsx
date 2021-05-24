import * as React from 'react';
import {Meta, Story} from '@storybook/react';
import {Shortcut, ShortcutProps} from '../../components/atoms/Shortcut';

export default {
    title: 'atoms/Shortcut',
    component: Shortcut,
} as Meta;

const Template: Story = args => <Shortcut {...args as ShortcutProps} />

export const shortcut = Template.bind({
    defaultValue: 'Shift',
    onChange: () => {}
} as ShortcutProps);