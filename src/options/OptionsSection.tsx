import styled from "styled-components";
import * as React from 'react';

type Props = {
    title: string
    children: JSX.Element | JSX.Element[]
}

export default function OptionsSection({title, children}: Props): JSX.Element {
    return <Row>
        <Header>{title}</Header>
        {children}
    </Row>
}

const Row = styled.div`
  padding: 10px;
  margin-left: 0;
  margin-right: 0;
  margin-bottom: 10px;
  background-color: #0C131B;
  display: flex;
  flex-direction: column;
`
const Header = styled.h2`
  width: 100%;
  text-align: center;
  margin: auto;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.1;
  padding-top: 5px;
  padding-bottom: 5px;
`