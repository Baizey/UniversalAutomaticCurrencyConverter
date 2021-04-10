import styled from "styled-components";
import * as React from 'react';

type Option = {
    value: string,
    text: string
}

type Props = {
    options: Option[],
    onChange: () => void
}

export default function Dropdown({options, onChange}: Props) {
    return <Container onChange={() => onChange()}>
        {options.map(option => <Opt value={option.value}>{option.text}</Opt>)}
    </Container>
}

type ContainerProps = { onChange: () => void }
const Container = styled.select<ContainerProps>`
  display: block;
  width: 100%;
  height: 34px;
  padding: 6px 12px;
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
  &:hover {
    transition: border-color 0.3s ease-in-out;
    border-color: #f0ad4e;
  }
`
const Opt = styled.option`
  text-align: center;
  text-align-last: center;

`