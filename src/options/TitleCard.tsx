import * as React from 'react'
import {useProvider} from "../Infrastructure";
import styled from "styled-components";
import {OptionRow, OptionsSection} from "./Shared";
import {ThemeProps} from '../Atoms/ThemeProps';

export function TitleCard() {
    const {browser} = useProvider()
    return <OptionsSection title={browser.extensionName}>
        <OptionRow key="footer-option">
            <Footer>{`Version ${browser.extensionVersion} created by ${browser.author}`}</Footer>
        </OptionRow>
    </OptionsSection>
}

const Footer = styled.div`
  margin: auto;
  text-align: center;
  color: ${(props: ThemeProps) => props.theme.footerText};
`