import * as React from 'react'
import styled from "styled-components";
import {OptionRow, OptionsSection} from "./Shared";
import {ThemeProps, useProvider} from '../../infrastructure';
import {Div, FooterText} from '../atoms';

export function TitleCard() {
    const {browser} = useProvider()
    return <OptionsSection title={browser.extensionName}>
        <OptionRow key="footer-option">
            <Footer>{`Version ${browser.extensionVersion} created by ${browser.author}`}</Footer>
        </OptionRow>
    </OptionsSection>
}

const Footer = styled(FooterText)`
  color: ${(props: ThemeProps) => props.theme.footerText};
`