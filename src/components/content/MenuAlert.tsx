import {AlertSection} from './AlertSection';
import * as React from 'react'
import styled from 'styled-components';
// noinspection ES6UnusedImports We need to import everything for it to work in browser
import {RadioBox, RadioBoxContainer, RadioBoxContainerProps, RadioBoxProps} from '../atoms/RadioBox';
// noinspection ES6UnusedImports We need to import everything for it to work in browser
import {Button, ButtonProps, Div, HeaderText, Space, SpaceProps, Title} from '../atoms';
import {ThemeProps} from '../../infrastructure';

type Props = { setDismissed: () => void }

export function MenuAlert({setDismissed}: Props) {
    return <AlertSection onDismiss={setDismissed} title="Context menu">
        <Section>
            <HeaderText>Site allowance</HeaderText>
        </Section>
        <Section>
            <HeaderText>Conversions</HeaderText>
        </Section>
        <Section>
            <HeaderText>Current page localization</HeaderText>
        </Section>
        <Section>
            <HeaderText>Convert to</HeaderText>
        </Section>
    </AlertSection>
}

const Section = styled(Div)<ThemeProps>`
  width: 100%;
  text-align: center;
  color: ${(props: ThemeProps) => props.theme.normalText};
  display: flex;
  flex-direction: column;
`