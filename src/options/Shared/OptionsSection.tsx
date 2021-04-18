import styled from "styled-components";
import * as React from 'react';

type Props = {
    title?: string
    children?: JSX.Element | JSX.Element[]
}

export function OptionsSection({title, children}: Props): JSX.Element {
    return <Container>
        {title ? <Header>{title}</Header> : <></>}
        {children}
    </Container>
}

const Container = styled.div`
  padding: 10px;
  margin-left: 0;
  margin-right: 0;
  margin-bottom: 10px;
  background-color: #0C131B;
  display: flex;
  flex-direction: column;
  border-width: 1px;
  border-color: #0C131B;
  border-style: solid;

  &:hover {
    border-color: #f0ad4e
  }
`
const Header = styled.h2`
  width: 100%;
  text-align: center;
  margin: auto;
  font-size: 18px;
  line-height: 1.1;
  padding-top: 5px;
  padding-bottom: 5px;
  font-weight: 700;
`