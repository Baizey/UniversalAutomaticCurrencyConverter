import * as React from 'react';
import { LocalizationCard } from './LocalizationCard';
import { ConvertToCard } from './ConvertToCard';
import { OptionCardProps } from '../OptionsApp';

export type CurrencyCardProps = { symbols: { label: string; value: string }[] };

export function CurrencyCard(props: OptionCardProps) {
  return (
    <>
      <ConvertToCard {...props} />
      <LocalizationCard {...props} />
    </>
  );
}
