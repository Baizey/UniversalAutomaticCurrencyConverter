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
    return <StyledInputContainer
        center={center}
        type="text"
        readOnly={true}
        placeholder={placeholder}
        value={defaultValue}
    />
}

export type StyledInputProps = {
    type: 'number' | 'text'
    borderHoverColor?: string
    onChange?: (value: number | string) => void
    onEnter?: (value: number | string) => void
} & ReadonlyInputProps

export function StyledInput({type, defaultValue, onChange, onEnter, placeholder, center, borderHoverColor}: StyledInputProps) {
    const [current, setCurrent] = useState(defaultValue)
    center = typeof center === 'boolean' ? center : true;
    return <StyledInputContainer
        center={center}
        borderHoverColor={borderHoverColor}
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

export type StyledInputContainerProps = { center: boolean, borderHoverColor?: string } & ThemeProps

function align(props: StyledInputContainerProps): 'right' | 'center' {
    if (props.center) return 'center';
    return 'right'
}

export const StyledInputContainer = styled(Input)<StyledInputContainerProps>((props: StyledInputContainerProps) => ({
    textAlign: align(props),
    textAlignLast: align(props),
    '&:focus': {
        outline: 0,
    },
    '&:hover': {
        borderColor: props.borderHoverColor || props.theme.formBorderFocus,
    }
}))