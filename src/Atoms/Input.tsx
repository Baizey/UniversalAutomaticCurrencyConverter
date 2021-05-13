import styled from "styled-components";
import * as React from 'react';
import {useState} from 'react';
import {ThemeProps} from './ThemeProps';

type ReadonlyInputProps = {
    center?: boolean
    placeholder?: string
    value: number | string,
}

export function ReadonlyInput({value, placeholder, center}: ReadonlyInputProps) {
    center = typeof center === 'boolean' ? center : true;
    return <Container
        center={center}
        type="text"
        readOnly={true}
        placeholder={placeholder}
        value={value}
    />
}

type InputProps = {
    type: 'number' | 'text'
    onChange?: (value: number | string) => void
    onEnter?: (value: number | string) => void
} & ReadonlyInputProps

export function Input({type, value, onChange, onEnter, placeholder, center}: InputProps) {
    const [current, setCurrent] = useState(value)
    center = typeof center === 'boolean' ? center : true;
    return <Container
        center={center}
        placeholder={placeholder}
        type={type}
        defaultValue={current}
        onChange={event => {
            setCurrent(event.target.value)
            onChange && onChange(event.target.value);
        }}
        onKeyUp={event => event.key === 'Enter' && onEnter && onEnter(current)}
    />
}

type ContainerProps = { center: boolean }
const Container = styled.input<ContainerProps>`
  display: block;
  width: 100%;
  height: 33px;
  padding: 0;
  font-size: 14px;
  line-height: 1.42857143;
  background-color: ${(props: ThemeProps) => props.theme.containerBackground};
  color: ${(props: ThemeProps) => props.theme.normalText};
  border: ${(props: ThemeProps) => `0 solid ${props.theme.inputUnderline}`};
  border-bottom-width: 1px;
  border-radius: 0;
  text-align: ${props => props.center ? 'center' : 'right'};
  text-align-last: ${props => props.center ? 'center' : 'right'};
  -webkit-appearance: none;
  -moz-appearance: none;;

  &:focus {
    outline: 0;
  }

  &:hover {
    transition: border-color 0.3s ease-in-out;
    border-color: ${(props: ThemeProps) => props.theme.borderFocus};
  }
`