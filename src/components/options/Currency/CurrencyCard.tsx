import * as React from 'react';
import {LocalizationCard} from './LocalizationCard';
import {ConvertToCard} from './ConvertToCard';

export type CurrencyCardProps = { symbols: { label: string, value: string }[] }

export function CurrencyCard(props: CurrencyCardProps) {
    return <>
        <ConvertToCard symbols={props.symbols}/>
        <LocalizationCard/>
    </>
}