import styled from "styled-components";
import * as React from 'react';
import {useEffect, useState} from 'react';
import {PropsTheme, StyleTheme} from './StyleTheme';

type Props = {
    value: boolean,
    onChange: (value: boolean) => void
}

export function Checkbox({value, onChange}: Props) {
    const [isChecked, setIsChecked] = useState(value);

    useEffect(() => onChange(isChecked), [isChecked]);

    return <Container
        checked={isChecked}
        onClick={() => setIsChecked(!isChecked)}>
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
  border: ${(props: StyleTheme) => `1px solid ${props.theme.headerText}`};
  position: relative;
  display: block;

  &:hover {
    transition: border-color 0.3s ease-in-out;
    border-color: ${(props: StyleTheme) => props.theme.borderFocus};
  }

  & div {
    position: absolute;
    height: 5px;
    background-color: ${(props: StyleTheme) => props.theme.success};
    transition: opacity 0.3s ease-in-out;
    opacity: ${(props) => props.checked ? 1 : 0};
  }

  & div:first-child {
    margin-top: 15px;
    margin-left: 0;
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