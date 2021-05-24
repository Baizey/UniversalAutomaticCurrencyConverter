import * as React from 'react';
import {Meta, Story} from '@storybook/react';
import {LocalizationAlert} from '../../components/content/LocalizationAlert';
import {MenuAlert} from '../../components/content/MenuAlert';
import {TitleAlert} from '../../components/content/TitleAlert';

export default {
    title: 'content/Alerts',
} as Meta;


const TileAlertTemplate: Story = (args) => <TitleAlert/>
export const title = TileAlertTemplate.bind({});

const LocalizationAlertTemplate: Story = (args) => <LocalizationAlert setDismissed={() => {}}/>
export const localization = LocalizationAlertTemplate.bind({});

const MenuAlertTemplate: Story = (args) => <MenuAlert setDismissed={() => {}}/>
export const menu = MenuAlertTemplate.bind({});