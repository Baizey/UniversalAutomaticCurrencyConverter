import * as React from 'react';
import { LocalizationCard } from './LocalizationCard';
import { ConvertToCard } from './ConvertToCard';

export function CurrencyCard() {
  return (
    <>
      <ConvertToCard />
      <LocalizationCard />
    </>
  );
}
