import styled from "styled-components";
import * as React from 'react';
import {useState} from 'react';

type Props = {
    placeholder?: string,
    type: 'number' | 'text'
    value: number | string,
    onChange?: (value: number | string) => void
    onEnter?: (value: number | string) => void
}

export function Input({type, value, onChange, onEnter, placeholder}: Props) {
    const [current, setCurrent] = useState(value)
    return <Container
        placeholder={placeholder} type={type} defaultValue={current}
        onChange={event => {
            setCurrent(event.target.value)
            onChange && onChange(event.target.value);
        }}
        onKeyUp={event => {
            if (event.key === 'Enter' && onEnter) onEnter(current)
        }}
    />
}

type ContainerProps = {}
const Container = styled.input<ContainerProps>`
  display: block;
  width: 100%;
  height: 33px;
  padding: 0;
  font-size: 14px;
  line-height: 1.42857143;
  background-color: #0C131B;
  color: #d0d0d0;
  border: 0 solid #2F373E;
  border-bottom-width: 1px;
  border-radius: 0;
  text-align: center;
  text-align-last: center;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;;

  &:focus {
    outline: 0;
  }

  &:hover {
    transition: border-color 0.3s ease-in-out;
    border-color: #f0ad4e;
  }
`