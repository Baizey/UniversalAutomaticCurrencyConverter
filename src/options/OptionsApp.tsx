import styled from "styled-components";
import * as react from 'react'
import {TitleCard} from "./TitleCard";
import {CurrencyCard} from "./CurrencyCard";
import {useEffect, useState} from "react";
import {LoadingCard} from "./LoadingCard";
import {DisableCurrenciesCard} from "./DisableCurrenciesCard";
import {AccessibilityCard} from "./AccessibilityCard";
import {LocalizationCard} from "./LocalizationCard";
import {FormattingCard} from "./FormattingCard";
import {HighlightCard} from "./HighlightCard";
import {DisplayCard} from "./DisplayCard";
import {AllowanceCard} from "./AllowanceCard";
import {ShortcutCard} from "./ShortcutCard";
import {FirstTimeProgressCard} from "./FirstTimeProgressCard";
import {Container} from "../Infrastructure";

const React = react;

export default function OptionsApp(): JSX.Element {
    const [isLoading, setIsLoading] = useState(true);
    const [firstTimeProgress, setFirstTimeProgress] = useState(0);
    const container = Container.factory();
    const config = container.configuration;
    const logger = container.logger;

    useEffect(() => {
        config.load().then(() => setIsLoading(false))
    }, [])

    function wrap(children: any) {
        return <Background>
            <Space/>
            <Wrapper>
                <TitleCard key="TitleCard-card"/>
                {children}
            </Wrapper>
        </Background>
    }

    if (isLoading) return wrap(<LoadingCard key="LoadingCard-card"/>)

    const settings = [
        <CurrencyCard key="CurrencyCard-card"/>,
        <DisableCurrenciesCard key="DisableCurrenciesCard-card"/>,
        <ShortcutCard key="ShortcutCard-card"/>,
        <AccessibilityCard key="AccessibilityCard-card"/>,
        <LocalizationCard key="LocalizationCard-card"/>,
        <FormattingCard key="FormattingCard-card"/>,
        <HighlightCard key="HighlightCard-card"/>,
        <DisplayCard key="DisplayCard-card"/>,
        <AllowanceCard key="AllowanceCard-card"/>
    ]

    if (config.firstTime.isFirstTime.value) return wrap([
        <Wrapper>{settings[firstTimeProgress]}</Wrapper>,
        <FirstTimeProgressCard
            progress={Math.min(100, 100 * firstTimeProgress / settings.length)}
            skip={() => config.firstTime.isFirstTime.setAndSaveValue(false)}
            next={() => setFirstTimeProgress(firstTimeProgress + 1)}/>
    ])

    return wrap(settings);
}

const Background = styled.div`
  width: 100%;
  min-height: 100%;
  height: fit-content;
  background-color: #0F171E;
  color: #d0d0d0;
  padding: 0;
  margin: 0;
`;

const Space = styled.div`
  height: 20px;
`

const Wrapper = styled.div`
  max-width: 800px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
`;