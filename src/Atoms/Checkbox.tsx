import styled from "styled-components";
import * as React from 'react';
import {useEffect, useState} from "react";

type Props = {
    initialValue: boolean,
    onChange: (value: boolean) => void
}

export default function Checkbox({initialValue, onChange}: Props) {
    const [isChecked, setIsChecked] = useState(initialValue);

    useEffect(() => onChange(isChecked), [isChecked]);

    return <Container checked={isChecked} onClick={() => setIsChecked(!isChecked)}>
        <div/>
        <div/>
    </Container>
}

type ContainerProps = { checked: boolean, onClick: () => void }
const Container = styled.div<ContainerProps>`
  margin: auto;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border: 1px solid grey;
  position: relative;
  display: block;

  &:hover {
    transition: border-color 0.3s ease-in-out;
    & div {
      transition: background-color 0.3s ease-in-out;
      background-color: #f0ad4e;
    }
    border-color: #f0ad4e;
  }

  & div {
    position: absolute;
    height: 5px;
    background-color: green;
    transition: opacity 0.3s ease-in-out;
    opacity: ${props => props.checked ? 1 : 0};
  }

  & div:first-child {
    margin-top: 15px;
    margin-left: 0px;
    width: 16px;
    transform: rotate(45deg);
  }

  & div:last-child {
    margin-top: 14px;
    margin-left: 9px;
    width: 20px;
    transform: rotate(135deg);
  }
`