import styled from "styled-components";
import * as React from 'react';
import {useState} from 'react';
import {ThemeProps} from '../../infrastructure';
import {Input} from './Basics';

export type ReadonlyInputProps = {
    center?: boolean
    placeholder?: string
    defaultValue: number | string,
}

export function ReadonlyInput({defaultValue, placeholder, center}: ReadonlyInputProps) {
    center = typeof center === 'boolean' ? center : true;
    return <Container
        center={center}
        type="text"
        readOnly={true}
        placeholder={placeholder}
        value={defaultValue}
    />
}

export type StyledInputProps = {
    type: 'number' | 'text'
    onChange?: (value: number | string) => void
    onEnter?: (value: number | string) => void
} & ReadonlyInputProps

export function StyledInput({type, defaultValue, onChange, onEnter, placeholder, center}: StyledInputProps) {
    const [current, setCurrent] = useState(defaultValue)
    center = typeof center === 'boolean' ? center : true;
    return <Container
        center={center}
        placeholder={placeholder}
        type={type}
        defaultValue={current}
        onChange={(event: any) => {
            setCurrent(event.target.value)
            onChange && onChange(event.target.value);
        }}
        onKeyUp={(event: any) => event.key === 'Enter' && onEnter && onEnter(current)}
    />
}

export type ContainerProps = { center: boolean } & ThemeProps

export const Container = styled(Input)<ContainerProps>`
  text-align: ${props => props.center ? 'center' : 'right'};
  text-align-last: ${props => props.center ? 'center' : 'right'};
  
  &:focus {
    outline: 0;
  }

  &:hover {
    transition: border-color 0.3s ease-in-out;
    border-color: ${(props) => props.theme.borderFocus};
  }
`