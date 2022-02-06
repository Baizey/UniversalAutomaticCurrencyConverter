import * as React from 'react';
import { HighlightCard } from './HighlightCard';
import { CustomDisplayCard } from './CustomDisplayCard';
import { NumberFormatCard } from './NumberFormatCard';
import { ThemeCard } from './ThemeCard';

export function VisualsCard() {
  return (
    <>
      <NumberFormatCard />
      <HighlightCard />
      <CustomDisplayCard />
      <ThemeCard />
    </>
  );
}
