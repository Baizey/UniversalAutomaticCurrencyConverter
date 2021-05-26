import * as React from 'react'
import {useState} from 'react'
import {TitleCard} from "./TitleCard";
import {LoadingCard} from "./Shared";
import {CurrencyCard} from './Currency/CurrencyCard';
import {VisualsCard} from './Visual/VisualsCard';
import {AccessibilityCard} from './Accessibility/AccessibilityCard';
import {ThemeProps, themes} from '../../infrastructure';
import {Div, Space} from '../atoms';
import {FilterOptionsCard} from './FilterOptionsCard';
import styled from 'styled-components';
import {NewUpdateCard} from './NewUpdateCard';

export type OptionsAppProps = {
    isLoading: boolean,
    setTheme: React.Dispatch<React.SetStateAction<keyof typeof themes>>,
    symbols: { label: string, value: string }[]
}

export type OptionCardProps = {
    filter: string
    setTheme: React.Dispatch<React.SetStateAction<keyof typeof themes>>,
    symbols: { label: string, value: string }[]
}

export default function OptionsApp(props: OptionsAppProps): JSX.Element {

    const [filter, setFilter] = useState<string>('')

    function wrap(children: JSX.Element[] | JSX.Element) {
        return <Background>
            <Space height={20}/>
            <Wrapper>
                <TitleCard key="TitleCard-card"/>
                <NewUpdateCard/>
                <FilterOptionsCard onChange={filter => setFilter(filter)}/>
                {children}
            </Wrapper>
        </Background>
    }

    if (props.isLoading) return wrap(<LoadingCard key="LoadingCard-card"/>)

    return wrap([
        <CurrencyCard {...props} filter={filter} key="CurrencyCard-card"/>,
        <VisualsCard {...props} filter={filter} key="VisualsCard-card"/>,
        <AccessibilityCard {...props} filter={filter} key="AccessibilityCard-card"/>,
    ]);
}

const Background = styled(Div)
    < ThemeProps > `
    min-height: 100%;
    height: fit-content;
    background-color: ${(props: ThemeProps) => props.theme.wrapperBackground};
    margin: 0;
    `;

const Wrapper = styled(Div)`
  background-color: ${(props: ThemeProps) => props.theme.wrapperBackground};
  max-width: 800px;
`;