import styled from "styled-components";
import * as React from 'react';
import {ThemeProps} from './ThemeProps';

type Props = {
    value: boolean,
    onClick: () => void
}

export function RadioBox({value, onClick}: Props) {
    return <Container
        checked={value}
        onClick={() => onClick()}>
        <div/>
    </Container>
}

type ContainerProps = { checked: boolean, onClick: () => void }
const Container = styled.div<ContainerProps>`
  margin: auto;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  border: ${(props: ThemeProps) => `1px solid ${props.theme.inputUnderline}`};
  position: relative;
  display: block;

  &:hover {
    transition: border-color 0.3s ease-in-out;
    border-color: ${(props: ThemeProps) => props.theme.borderFocus};
  }

  & div {
    height: 20px;
    width: 20px;
    margin: auto;
    margin-top: 5px;
    border-radius: 10px;
    background-color: ${(props: ThemeProps) => props.theme.success};
    transition: opacity 0.3s ease-in-out;
    opacity: ${(props) => props.checked ? 1 : 0};
  }
`