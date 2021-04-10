import * as React from 'react';
import styled from "styled-components";

type Props = {
    children: JSX.Element | JSX.Element[]
}

export default function OptionRow({children}: Props): JSX.Element {
    children = Array.isArray(children) ? children : [children];
    return <Container childrenCount={children.length}>
        {children.map(e => <div>{e}</div>)}
    </Container>
}

type ContainerProps = { childrenCount: number }
const Container = styled.div<ContainerProps>`
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: row;
  
  & > * {
    width: ${props => (100 / props.childrenCount) + '%'}
  }
`