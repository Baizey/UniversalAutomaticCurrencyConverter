import * as React from 'react';
import {Meta, Story} from '@storybook/react';
import {RadioBox, Title} from '../../components/atoms';
import {RadioBoxProps} from '../../components/atoms/RadioBox';

export default {
    title: 'atoms/Radiobox',
    component: Title,
} as Meta;

const Template: Story = (args) => <RadioBox {...args as RadioBoxProps} />;

export const radiobox = Template.bind({});
radiobox.args = {
    value: false,
    onClick: () => {}
}