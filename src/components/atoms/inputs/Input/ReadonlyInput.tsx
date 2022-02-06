import * as React from 'react';
import { Input, InputProps } from './Input';

export function ReadonlyInput(props: InputProps<number | string>) {
  return (
    <Input<string | number>
      {...props}
      type="text"
      mapper={(e) => e}
      readonly={true}
    />
  );
}
