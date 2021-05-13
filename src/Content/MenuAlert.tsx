import {AlertSection} from './AlertSection';
import * as React from 'react'
import styled from 'styled-components';
import {ThemeProps} from '../Atoms/ThemeProps';

type Props = { setDismissed: () => void }

export function MenuAlert({setDismissed}: Props) {
    return <AlertSection onDismiss={setDismissed} title="Context menu">
        <Section>
            <Title>Site allowance</Title>
        </Section>
        <Section>
            <Title>Conversions</Title>
        </Section>
        <Section>
            <Title>Current page localization</Title>
        </Section>
        <Section>
            <Title>Convert to</Title>
        </Section>
    </AlertSection>
}

const Section = styled.div`
  width: 100%;
  text-align: center;
  color: ${(props: ThemeProps) => props.theme.normalText};
  display: flex;
  flex-direction: column;
`

const Title = styled.h2`
  width: 100%;
  font-size: 1.2em;
  font-weight: bold;
  color: ${(props: ThemeProps) => props.theme.titleText};
`