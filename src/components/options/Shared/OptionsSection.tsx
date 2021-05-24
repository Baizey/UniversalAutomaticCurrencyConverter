import styled from "styled-components";
import * as React from 'react';
import {ThemeProps} from '../../../infrastructure';
import {Div, Title} from '../../atoms';

type Props = {
    title?: string
    children?: JSX.Element | JSX.Element[]
}

export function OptionsSection({title, children}: Props): JSX.Element {
    return <Container>
        {title ? <Title>{title}</Title> : <></>}
        {children}
    </Container>
}

const Container = styled(Div)`
  padding: 10px;
  background-color: ${(props: ThemeProps) => props.theme.containerBackground};
  display: flex;
  flex-direction: column;
  border-width: 1px;
  border-color: ${(props: ThemeProps) => props.theme.containerBackground};
  border-style: solid;

  & > not:first-child {
    margin-top: 40px;
  }
  
  &:hover {
    border-color: ${(props: ThemeProps) => props.theme.borderDimFocus};
  }
`