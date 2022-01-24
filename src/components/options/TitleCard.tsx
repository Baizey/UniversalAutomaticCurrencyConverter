import * as React from "react";
import styled from "styled-components";
import { OptionRow, OptionsSection, SettingOption } from "./Shared";
import { ThemeProps, useProvider } from "../../infrastructure";
import { FooterText } from "../atoms";

export function TitleCard() {
  const { browser } = useProvider();
  return <OptionsSection title={browser.extensionName}>
    <OptionRow key="footer-option">
      <SettingOption title="Options page">
        <Footer>{`Version ${browser.extensionVersion} created by ${browser.author}`}</Footer>
      </SettingOption>
    </OptionRow>
  </OptionsSection>;
}

const Footer = styled(FooterText)`
  color: ${(props: ThemeProps) => props.theme.footerText};
`;