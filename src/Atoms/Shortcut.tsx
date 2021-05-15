import styled from "styled-components";
import * as React from 'react';
import {useState} from 'react';
import {ThemeProps} from '../Infrastructure/Theme';

type Props<> = {
    defaultValue: string,
    onChange: (value: string) => void
}

export function Shortcut({defaultValue, onChange}: Props) {
    const [value, setValue] = useState(defaultValue);
    return <Container
                tabIndex={0}
        onClick={() => {
            setValue('');
            onChange('');
        }}
        onKeyDown={event => {
            setValue(event.key);
            onChange(event.key);
        }}>{value}</Container>
}

type ContainerProps = {} & ThemeProps
const Container = styled.div<ContainerProps>`
  display: block;
  width: 100%;
  line-height: 33px;
  height: 33px;
  padding: 0;
  font-size: 14px;
  background-color: ${(props) => props.theme.containerBackground};
  color: ${(props) => props.theme.normalText};
  border: ${(props) => `0 solid ${props.theme.inputUnderline}`};
  border-bottom-width: 1px;
  border-radius: 0;
  text-align: center;
  text-align-last: center;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;;

  &:hover {
    transition: border-color 0.3s ease-in-out;
    border-color: ${(props) => props.theme.borderFocus};
  }
`