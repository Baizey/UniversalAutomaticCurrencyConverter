import * as React from 'react';
import styled from 'styled-components';
import {useProvider} from '../Infrastructure';
import {ThemeProps} from '../Atoms/ThemeProps';

export function TitleAlert() {
    const {browser} = useProvider();
    return <Container>
        <MenuTitle>{browser.extensionName}</MenuTitle>
    </Container>
}

const Container = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: ${(props: ThemeProps) => props.theme.containerBorder};
  color: ${(props: ThemeProps) => props.theme.headerText};
  width: 100%;
  text-align: center;
  height: fit-content;
`

const MenuTitle = styled.span`
  font-size: 10px;
  text-align: center;
  margin: auto;
  width: 100%;
  display: block;
  font-weight: bold;
`