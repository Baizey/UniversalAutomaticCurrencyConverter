import * as React from 'react'
import {Browser, IBrowser} from "../Infrastructure";
import styled from "styled-components";
import {OptionRow, OptionsSection} from "./Shared";

export function TitleCard(injection: { browser?: IBrowser }) {
    const browser: IBrowser = injection.browser || Browser.instance();
    return <OptionsSection title={'UA Currency Converter'}>
        <OptionRow>
            <Footer>{`Version ${browser.extensionVersion} created by ${browser.author}`}</Footer>
        </OptionRow>
    </OptionsSection>
}

const Footer = styled.div`
  margin: auto;
  text-align: center;
  color: grey;
`