import * as React from 'react';
import {Meta, Story} from '@storybook/react';
import PopupApp from '../../components/popup/PopupApp';
import {AlertSection, AlertSectionProps} from '../../components/content/AlertSection';

export default {
    title: 'content/Shared',
    component: PopupApp,
} as Meta;

const OptionSectionTemplate: Story = (args) => <AlertSection {...args as AlertSectionProps}/>

export const section = OptionSectionTemplate.bind({});
section.args = {title: 'Title'} as AlertSectionProps
