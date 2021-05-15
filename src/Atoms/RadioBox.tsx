import styled from "styled-components";
import * as React from 'react';
import {useProvider} from '../Infrastructure';
import {ThemeProps} from '../Infrastructure/Theme';

export type RadioBoxProps = {
    value: boolean,
    onClick: () => void
}

export function RadioBox({value, onClick}: RadioBoxProps) {
    const {theme} = useProvider()
    return <RadioBoxContainer
        checked={value}
        onClick={() => onClick()}>
        <div/>
    </RadioBoxContainer>
}

export type RadioBoxContainerProps = { checked: boolean, onClick: () => void } & ThemeProps
export const RadioBoxContainer = styled.div<RadioBoxContainerProps>`
  margin: auto;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  border: ${props => `1px solid ${props.theme.inputUnderline}`};
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