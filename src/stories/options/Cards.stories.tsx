import * as React from 'react';
import {Meta, Story} from '@storybook/react';
import {LoadingCard} from '../../components/options/Shared';
import {TitleCard} from '../../components/options/TitleCard';
import {CurrencyCard, CurrencyCardProps} from '../../components/options/Currency/CurrencyCard';
import {AccessibilityCard, AccessibilityCardProps} from '../../components/options/Accessibility/AccessibilityCard';
import {VisualCardProps, VisualsCard} from '../../components/options/Visual/VisualsCard';

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

const CurrencyCardTemplate: Story = (args) => <CurrencyCard {...args as CurrencyCardProps} />
export const currencyCard = CurrencyCardTemplate.bind({});
currencyCard.args = {symbols: options} as CurrencyCardProps

const AccessibilityCardTemplate: Story = (args) => <AccessibilityCard {...args as AccessibilityCardProps} />
export const accessibilityCard = AccessibilityCardTemplate.bind({});
accessibilityCard.args = {symbols: options} as AccessibilityCardProps

const VisualCardTemplate: Story = (args) => <VisualsCard {...args as VisualCardProps} />
export const visualCard = VisualCardTemplate.bind({});
visualCard.args = {setTheme: () => {}} as VisualCardProps