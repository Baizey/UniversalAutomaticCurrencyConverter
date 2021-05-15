import * as React from 'react';
import styled from 'styled-components';
import {useProvider} from '../Infrastructure';
import {ThemeProps} from '../Infrastructure/Theme';

export function TitleAlert() {
    const {browser} = useProvider();
    return <Container>
        <MenuTitle>{browser.extensionName}</MenuTitle>
    </Container>
}

const Container = styled.div<ThemeProps>`
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: ${props => props.theme.containerBorder};
  color: ${props => props.theme.headerText};
  width: 100%;
  text-align: center;
  height: fit-content;
`

const MenuTitle = styled.span<ThemeProps>`
  font-size: 10px;
  text-align: center;
  margin: auto;
  width: 100%;
  display: block;
  font-weight: bold;
`