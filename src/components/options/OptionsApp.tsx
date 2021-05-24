import styled from "styled-components";
import * as React from 'react'
import {TitleCard} from "./TitleCard";
import {LoadingCard} from "./Shared";
import {CurrencyCard} from './Currency/CurrencyCard';
import {VisualsCard} from './Visual/VisualsCard';
import {AccessibilityCard} from './Accessibility/AccessibilityCard';
import {ThemeProps, themes} from '../../infrastructure';
import {Div, Space} from '../atoms';

export type OptionsAppProps = {
    isLoading: boolean,
    setTheme: React.Dispatch<React.SetStateAction<keyof typeof themes>>,
    symbols: { label: string, value: string }[]
}
export default function OptionsApp({isLoading, setTheme, symbols}: OptionsAppProps): JSX.Element {

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
        <Gap height={20}/>,
        <CurrencyCard symbols={symbols} key="CurrencyCard-card"/>,
        <Gap height={20}/>,
        <VisualsCard setTheme={setTheme} key="VisualsCard-card"/>,
        <Gap height={20}/>,
        <AccessibilityCard symbols={symbols} key="AccessibilityCard-card"/>,
    ]);
}

const Gap = styled(Space)(props => ({
    backgroundColor: props.theme.wrapperBackground
}))

const Background = styled(Div)<ThemeProps>`
  min-height: 100%;
  height: fit-content;
  background-color: ${props => props.theme.wrapperBackground};
  margin: 0;
`;

const Wrapper = styled(Div)`
  max-width: 800px;
`;