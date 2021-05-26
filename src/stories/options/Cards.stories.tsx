import * as React from 'react';
import {Meta, Story} from '@storybook/react';
import {LoadingCard} from '../../components/options/Shared';
import {TitleCard} from '../../components/options/TitleCard';
import {CurrencyCard} from '../../components/options/Currency/CurrencyCard';
import {AccessibilityCard} from '../../components/options/Accessibility/AccessibilityCard';
import {VisualsCard} from '../../components/options/Visual/VisualsCard';
import {OptionCardProps} from "../../components/options/OptionsApp";

export default {
    title: 'options/Cards',
} as Meta;

const currencies = ['USD', 'CAD', 'EUR', 'DKK']
const options = currencies.map(e => ({label: e, value: e}));

const TitleCardTemplate: Story = (args) => <TitleCard {...args} />
export const titleCard = TitleCardTemplate.bind({});
titleCard.args = {}

const LoadingCardTemplate: Story = (args) => <LoadingCard {...args} />
export const loadingCard = LoadingCardTemplate.bind({});
loadingCard.args = {title: ''}

const CurrencyCardTemplate: Story = (args) => <CurrencyCard {...args as OptionCardProps} />
export const currencyCard = CurrencyCardTemplate.bind({});
currencyCard.args = {symbols: options}

const AccessibilityCardTemplate: Story = (args) => <AccessibilityCard {...args as OptionCardProps} />
export const accessibilityCard = AccessibilityCardTemplate.bind({});
accessibilityCard.args = {symbols: options}

const VisualCardTemplate: Story = (args) => <VisualsCard {...args as OptionCardProps} />
export const visualCard = VisualCardTemplate.bind({});
visualCard.args = {
    setTheme: () => {
    }
}