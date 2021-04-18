import * as React from 'react'
import {Container, useContainer} from "../Infrastructure";
import styled from "styled-components";
import {OptionRow, OptionsSection} from "./Shared";

export function TitleCard() {
    const {browser} = useContainer()
    return <OptionsSection title={'UA BackendApi Currency'}>
        <OptionRow key="footer-option">
            <Footer>{`Version ${browser.extensionVersion} created by ${browser.author}`}</Footer>
        </OptionRow>
    </OptionsSection>
}

const Footer = styled.div`
  margin: auto;
  text-align: center;
  color: grey;
`