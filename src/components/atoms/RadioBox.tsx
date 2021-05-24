import styled from "styled-components";
import * as React from 'react';
import {ThemeProps} from '../../infrastructure';
import {Div} from './Basics';

export type RadioBoxProps = {
    value: boolean,
    onClick: () => void
}

export function RadioBox({value, onClick}: RadioBoxProps) {
    return <RadioBoxContainer
        checked={value}
        onClick={() => onClick()}>
        <div/>
    </RadioBoxContainer>
}

export type RadioBoxContainerProps = { checked: boolean, onClick: () => void } & ThemeProps
export const RadioBoxContainer = styled(Div)<RadioBoxContainerProps>`
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  border-width: 1px;
  position: relative;
  display: block;

  &:hover {
    transition: border-color 0.3s ease-in-out;
    border-color: ${props => props.theme.borderFocus};
  }

  & div {
    height: 20px;
    width: 20px;
    margin: auto;
    margin-top: 5px;
    border-radius: 10px;
    background-color: ${props => props.theme.success};
    transition: opacity 0.3s ease-in-out;
    opacity: ${props => props.checked ? 1 : 0};
  }
`