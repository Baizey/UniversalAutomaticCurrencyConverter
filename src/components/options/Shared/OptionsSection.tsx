import styled from "styled-components";
import * as React from 'react';
import {MyTheme, ThemeProps, themes, useProvider} from '../../../infrastructure';
import {Div, Title} from '../../atoms';

type Props = {
    title?: string
    children?: JSX.Element | JSX.Element[]
}

export function OptionsSection({title, children}: Props): JSX.Element {
    const {colorTheme} = useProvider();
    return <Container colorTheme={colorTheme.value}>
        {title ? <Title>{title}</Title> : <></>}
        {children}
    </Container>
}

export type ContainerProps = {
    colorTheme: keyof typeof themes
} & ThemeProps

const Container = styled(Div)<ContainerProps>`
  padding: 10px;
  background-color: ${(props: ThemeProps) => props.theme.containerBackground};
  display: flex;
  flex-direction: column;
  border-width: 1px;
  border-color: ${(props: ThemeProps) => props.theme.containerBorder};

  &:first-child {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  &:not(:first-child) {
    margin-top: 15px;
  }

  &:last-child {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  &:not(:last-child) {
  }
`