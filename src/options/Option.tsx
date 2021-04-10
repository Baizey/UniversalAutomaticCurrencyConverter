import * as React from 'react';
import styled from "styled-components";

type Props = {
    title: string,
    children?: JSX.Element | JSX.Element[],
    help?: string
}

export default function Option({title, children, help}: Props): JSX.Element {
    return <Container>
        <Label>{title}</Label>
        {children ? children : <></>}
        {help ? <Help>{help}</Help> : <></>}
    </Container>
}

const Container = styled.div`
`

const Label = styled.label`
  width: 100%;
  margin: auto;
  text-align: center;
  display: block;
  font-size: 10px;
  color: grey;
`

const Help = styled.span`
  display: block;
  width: 100%;
  margin: auto;
  text-align: center;
  color: #737373;
`