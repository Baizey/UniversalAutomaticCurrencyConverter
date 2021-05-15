import styled from "styled-components";
import * as React from 'react'
import {TitleCard} from "./TitleCard";
import {LoadingCard} from "./Shared";
import {ThemeProps, themes} from '../Infrastructure/Theme';
import {Space} from '../Atoms';
import {CurrencyCard} from './Currency/CurrencyCard';
import {VisualsCard} from './Visual/VisualsCard';
import {AccessibilityCard} from './Accessibility/AccessibilityCard';

type Props = {
    isLoading: boolean,
    setTheme: React.Dispatch<React.SetStateAction<keyof typeof themes>>,
    symbols: { label: string, value: string }[]
}
export default function OptionsApp({isLoading, setTheme, symbols}: Props): JSX.Element {

    function wrap(children: any) {
        return <Background>
            <Space height={20}/>
            <Wrapper>
                <TitleCard key="TitleCard-card"/>
                {children}
            </Wrapper>
        </Background>
    }

    if (isLoading) return wrap(<LoadingCard key="LoadingCard-card"/>)

    return wrap([
        <CurrencyCard symbols={symbols} key="CurrencyCard-card"/>,
        <VisualsCard setTheme={setTheme} key="VisualsCard-card"/>,
        <AccessibilityCard symbols={symbols} key="AccessibilityCard-card"/>,
    ]);
}

const Background = styled.div<ThemeProps>`
  width: 100%;
  min-height: 100%;
  height: fit-content;
  background-color: ${props => props.theme.wrapperBackground};
  color: ${props => props.theme.normalText};
  padding: 0;
  margin: 0;
`;

const Wrapper = styled.div`
  max-width: 800px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
`;