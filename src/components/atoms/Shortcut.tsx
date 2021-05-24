import styled from "styled-components";
import * as React from 'react';
import {useState} from 'react';
import {ThemeProps} from '../../infrastructure';
import {Div} from './Basics';

export type ShortcutProps = {
    defaultValue: string,
    onChange: (value: string) => void
}

export function Shortcut({defaultValue, onChange}: ShortcutProps) {
    const [value, setValue] = useState(defaultValue);
    return <Container
                tabIndex={0}
        onClick={() => {
            setValue('');
            onChange('');
        }}
        onKeyDown={(event: any) => {
            setValue(event.key);
            onChange(event.key);
        }}>{value}</Container>
}

type ContainerProps = {} & ThemeProps
const Container = styled(Div)<ContainerProps>`
  display: block;
  line-height: 33px;
  height: 33px;
  border-bottom-width: 1px;
  border-radius: 0;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;;

  &:hover {
    transition: border-color 0.3s ease-in-out;
    border-color: ${(props) => props.theme.borderFocus};
  }
`