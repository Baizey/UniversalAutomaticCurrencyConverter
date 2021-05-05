import styled, {ThemeProvider} from 'styled-components';
import * as React from 'react'
import {DarkTheme} from '../Atoms/Theme';

export function MenuWrapper() {
    return <ThemeProvider theme={DarkTheme}>
        <Container>
            <Header>
                <MenuTitle>Universal Automatic Currency Converter</MenuTitle>
            </Header>
        </Container>
    </ThemeProvider>
}

const Container = styled.div`
  font-family: Arial, sans-serif;
  width: 350px;
  height: fit-content;
  z-index: 1000;
  right: 25px;
  bottom: 15px;
  position: fixed;

  & > div:only-child {
    display: none
  }

  & > div:not(:first-child) {
    border-top-color: transparent;
  }

  & > div:first-child {
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
  }

  & > div:last-child {
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
  }
`

const Header = styled.div`
`

const MenuTitle = styled.span`
  font-size: 1.5em;
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  margin-top: 5px;
`