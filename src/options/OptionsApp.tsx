import styled from "styled-components";
import * as react from 'react'
import {TitleCard} from "./TitleCard";
import {CurrencyCard} from "./CurrencyCard";

const React = react;

export default function OptionsApp(): JSX.Element {
    return <Background>
        <Space/>
        <Container>
            <TitleCard/>
            <CurrencyCard/>
        </Container>
    </Background>
}

const Background = styled.div`
  width: 100%;
  height: 100%;
  background-color: #0F171E;
  color: #d0d0d0;
  padding: 0;
  margin: 0;
`;

const Space = styled.div`
  height: 20px;
`

const Container = styled.div`
  width: 800px;
  margin-left: auto;
  margin-right: auto;
`;