import * as React from 'react';
import {Meta, Story} from '@storybook/react';
import {LocalizationAlert} from '../../components/content/LocalizationAlert';
import {MenuAlert} from '../../components/content/MenuAlert';
import {TitleAlert} from '../../components/content/TitleAlert';
import {useProvider} from '../../infrastructure';

export default {
    title: 'content/Alerts',
} as Meta;


const TileAlertTemplate: Story = (args) => <TitleAlert/>
export const title = TileAlertTemplate.bind({});

const LocalizationAlertTemplate: Story = (args) => {
    const {activeLocalization} = useProvider();
    activeLocalization.krone.defaultValue = 'SEK'
    activeLocalization.dollar.defaultValue = 'USD'
    activeLocalization.yen.defaultValue = 'CNY'
    if (args.kroneConflict) activeLocalization.krone.detectedValue = 'DKK'
    else activeLocalization.krone.detectedValue = activeLocalization.krone.defaultValue
    if (args.yenConflict) activeLocalization.yen.detectedValue = 'JPY'
    else activeLocalization.yen.detectedValue = activeLocalization.yen.defaultValue
    if (args.dollarConflict) activeLocalization.dollar.detectedValue = 'CAD'
    else activeLocalization.dollar.detectedValue = activeLocalization.dollar.defaultValue
    return <LocalizationAlert setDismissed={() => {}}/>;
}
export const localization = LocalizationAlertTemplate.bind({});
localization.args = {
    kroneConflict: true,
    yenConflict: true,
    dollarConflict: true,
}

const MenuAlertTemplate: Story = (args) => <MenuAlert setDismissed={() => {}}/>
export const menu = MenuAlertTemplate.bind({});