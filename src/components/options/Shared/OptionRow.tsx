import * as React from 'react';
import styled from "styled-components";
import {Div} from '../../atoms';
import {ThemeProps} from '../../../infrastructure';

export type OptionRowProps = {
    children: JSX.Element | JSX.Element[]
}

export function OptionRow({children}: OptionRowProps): JSX.Element {
    children = Array.isArray(children) ? children : [children];
    return <Container childrenCount={children.length}>
        {children.map(e => <div key={`${Math.random()}-optionrow`}>{e}</div>)}
    </Container>
}

type ContainerProps = { childrenCount: number }
const Container = styled(Div)<ContainerProps>`
  width: 100%;
  padding-bottom: 10px;
  display: flex;
  flex-direction: row;

  & > * {
    width: ${(props: ContainerProps) => (100 / props.childrenCount) + '%'}
  }
`