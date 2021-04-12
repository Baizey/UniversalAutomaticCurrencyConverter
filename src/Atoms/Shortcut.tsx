import styled from "styled-components";
import * as React from 'react';
import {useState} from "react";

type Props<> = {
    defaultValue: string,
    onChange: (value: string) => void
}

export function Shortcut({defaultValue, onChange}: Props) {
    const [value, setValue] = useState(defaultValue);
    return <Container
        tabIndex={0}
        onKeyDown={event => {
            setValue(event.key);
            onChange(event.key);
        }}>{value}</Container>
}

type ContainerProps = {}
const Container = styled.div<ContainerProps>`
  display: block;
  width: 100%;
  line-height: 33px;
  height: 33px;
  padding: 0;
  font-size: 14px;
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

  &:hover {
    transition: border-color 0.3s ease-in-out;
    border-color: #f0ad4e;
  }
`