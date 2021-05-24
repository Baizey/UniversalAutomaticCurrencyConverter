import * as React from 'react';
import styled from 'styled-components';
import {ThemeProps, useProvider} from '../../infrastructure';
import {Div, FooterText} from '../atoms';

export function TitleAlert() {
    const {browser} = useProvider();
    return <Container>
        <MenuTitle>{browser.extensionName}</MenuTitle>
    </Container>
}

const Container = styled(Div)<ThemeProps>`
  padding-top: 10px;
  padding-bottom: 10px;
  border-width: 1px;
  background-color: ${props => props.theme.containerBorder};
  color: ${props => props.theme.headerText};
  text-align: center;
  height: fit-content;
`

const MenuTitle = styled(FooterText)<ThemeProps>`
  color: ${props => props.theme.normalText};
  background-color: ${props => props.theme.containerBorder};
`