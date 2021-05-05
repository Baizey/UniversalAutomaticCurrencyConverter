import * as React from 'react'
import {useProvider} from "../Infrastructure";
import styled from "styled-components";
import {OptionRow, OptionsSection} from "./Shared";
import {StyleTheme} from '../Atoms/StyleTheme';

export function TitleCard() {
    const {browser} = useProvider()
    return <OptionsSection title={'UA Currency Converter'}>
        <OptionRow key="footer-option">
            <Footer>{`Version ${browser.extensionVersion} created by ${browser.author}`}</Footer>
        </OptionRow>
    </OptionsSection>
}

const Footer = styled.div`
  margin: auto;
  text-align: center;
  color: ${(props: StyleTheme) => props.theme.footerText};
`