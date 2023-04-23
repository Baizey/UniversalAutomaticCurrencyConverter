import {useSignal} from '@preact/signals'
import * as React from 'preact/compat'
import {useEffect} from 'preact/compat'
import {RawNumberInput, RawTextInput} from '../core'
import {InputProps as InputP} from "@baizey/styled-preact";

type InputStyleProps = {
    borderHoverColor?: string;
    align?: 'left' | 'center' | 'right';
    placeholder?: string;
    placeholderColor?: string;
}

export type InputProps<T> = InputP & InputStyleProps & {
    onEnter?: (value: T) => void
    onValueChange?: (value: T) => void
    value?: T
} & {
    onInput?: never
    onChange?: never
};

export const ReadonlyInput = (props: InputProps<string>) =>
    <RawTextInput  {...props} readOnly/>

export const NumberInput = ({
                                onEnter = () => {
                                },
                                onValueChange = () => {
                                },
                                value = 0,
                                ...props
                            }: InputProps<number>) => {
    const currentValue = useSignal<number>(value)
    useEffect(() => {
        currentValue.value = value
    }, [value])

    return <RawNumberInput {...props}
                           value={currentValue.value}
                           onInput={e => {
                               const value = Number(e.target.value)
                               currentValue.value = value
                               onValueChange(value)
                           }}
                           onKeyUp={p => p.key === 'Enter' && onEnter(currentValue.value)}
    />
}

export const TextInput = ({
                              onEnter = () => {
                              },
                              onValueChange = () => {
                              },
                              value = '',
                              ...props
                          }: InputProps<string>) => {
    const currentValue = useSignal(value)
    useEffect(() => {
        currentValue.value = value
    }, [value])

    return <RawTextInput {...props}
                         value={currentValue.value}
                         onInput={e => {
                             const value = String(e.target.value)
                             currentValue.value = value
                             onValueChange(value)
                         }}
                         onKeyUp={p => p.key === 'Enter' && onEnter(currentValue.value)}
    />
}