import styled from 'styled-components';
import * as React from 'react';
import { useState } from 'react';
import { ThemeProps } from '../../../infrastructure';
import { Div } from '../Basics';

export type ShortcutProps = {
  defaultValue: string;
  onChange: (value: string) => void;
};

export function Shortcut({ defaultValue, onChange }: ShortcutProps) {
  const [value, setValue] = useState(defaultValue);
  return (
    <Container
      tabIndex={0}
      onClick={() => {
        setValue('');
        onChange('');
      }}
      onKeyDown={(event: any) => {
        setValue(event.key);
        onChange(event.key);
      }}
    >
      {value}
    </Container>
  );
}

type ContainerProps = {} & ThemeProps;

const Container = styled(Div)((props: ContainerProps) => ({
  display: 'block',
  lineHeight: '33px',
  height: '33px',
  borderBottomWidth: '1px',
  borderRadius: 0,
  cursor: 'pointer',
  '-webkit-appearance': 'none',
  '-moz-appearance': 'none',
  '&:hover': {
    borderColor: props.theme.formBorderFocus,
  },
}));
