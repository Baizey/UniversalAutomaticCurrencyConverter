import * as React from 'react';
import { Input, InputProps } from './Input';

export function TextInput(props: InputProps<string>) {
  return <Input<string> {...props} type="text" mapper={(e) => e} />;
}
