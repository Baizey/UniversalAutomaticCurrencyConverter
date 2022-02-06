import * as React from 'react';
import { OptionsSection } from './';

type Props = {
  title?: string;
};

export function LoadingCard(props: Props) {
  const title = props.title || 'Loading...';
  return <OptionsSection title={title} />;
}
