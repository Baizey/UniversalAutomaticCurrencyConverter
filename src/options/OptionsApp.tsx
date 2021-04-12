import styled from "styled-components";
import * as react from 'react'
import {TitleCard} from "./TitleCard";
import {CurrencyCard} from "./CurrencyCard";
import {Configuration, IBrowser} from "../Infrastructure";
import {useEffect, useState} from "react";
import {LoadingCard} from "./LoadingCard";
import {DisableCurrenciesCard} from "./DisableCurrenciesCard";
import {AccessibilityCard} from "./AccessibilityCard";
import {LocalizationCard} from "./LocalizationCard";
import {FormattingCard} from "./FormattingCard";
import {HighlightCard} from "./HighlightCard";
import {DisplayCard} from "./DisplayCard";
import {AllowanceCard} from "./AllowanceCard";

const React = react;

export default function OptionsApp(injection: { browser?: IBrowser, config?: Configuration }): JSX.Element {
    const [isLoading, setIsLoading] = useState(true);
    const config = injection.config || Configuration.instance();

    useEffect(() => {
        config.load().then(() => setIsLoading(false))
    }, [])

    const content = isLoading
        ? <LoadingCard key="LoadingCard-card"/>
        : <>
            <CurrencyCard key="CurrencyCard-card" browser={injection.browser} config={injection.config}/>
            <DisableCurrenciesCard key="DisableCurrenciesCard-card" browser={injection.browser} config={injection.config}/>
            <AccessibilityCard key="AccessibilityCard-card" browser={injection.browser} config={injection.config}/>
            <LocalizationCard key="LocalizationCard-card" browser={injection.browser} config={injection.config}/>
            <FormattingCard key="FormattingCard-card" browser={injection.browser} config={injection.config}/>
            <HighlightCard key="HighlightCard-card" browser={injection.browser} config={injection.config}/>
            <DisplayCard key="DisplayCard-card" browser={injection.browser} config={injection.config}/>
            <AllowanceCard key="AllowanceCard-card" browser={injection.browser} config={injection.config}/>
        </>

    return <Background>
        <Space/>
        <Container>
            <TitleCard key="TitleCard-card"/>
            {content}
        </Container>
    </Background>
}

const Background = styled.div`
  width: 100%;
  height: fit-content;
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