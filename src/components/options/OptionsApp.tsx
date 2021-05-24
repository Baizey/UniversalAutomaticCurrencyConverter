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
        <CurrencyCard symbols={symbols} key="CurrencyCard-card"/>,
        <VisualsCard setTheme={setTheme} key="VisualsCard-card"/>,
        <AccessibilityCard symbols={symbols} key="AccessibilityCard-card"/>,
    ]);
}

const Gap = styled(Space)((props: ThemeProps) => ({
    backgroundColor: props.theme.wrapperBackground,
    borderColor: props.theme.containerBorder,
    borderStyle: 'dashed',
    borderRadius: 0,
    borderWidth: 0,
    borderLeftWidth: '1px',
    borderRightWidth: '1px',
}))

const Background = styled(Div)<ThemeProps>`
  min-height: 100%;
  height: fit-content;
  background-color: ${(props: ThemeProps) => props.theme.wrapperBackground};
  margin: 0;
`;

const Wrapper = styled(Div)`
  background-color: ${(props: ThemeProps) => props.theme.wrapperBackground};
  max-width: 800px;
`;