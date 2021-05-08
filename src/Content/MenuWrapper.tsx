import styled, {ThemeProvider} from 'styled-components';
import * as React from 'react'
import {mapToTheme, StyleTheme} from '../Atoms/StyleTheme';
import {useProvider} from '../Infrastructure';
import {TitleAlert} from './TitleAlert';
import {LocalizationAlert} from './LocalizationAlert';

export function MenuWrapper() {
    const {colorTheme, activeLocalization} = useProvider();
    return <ThemeProvider theme={mapToTheme(colorTheme.value)}>
        <Container>
            <TitleAlert/>
            {activeLocalization.hasConflict() ? <LocalizationAlert/> : <></>}
        </Container>
    </ThemeProvider>
}

const Container = styled.div`
  font-family: Arial, sans-serif;
  width: 100%;
  border-radius: 5px;
  height: fit-content;

  & > div {
    border-width: 1px;
    border-color: ${(props: StyleTheme) => props.theme.containerBorder};
    border-style: solid;
  }

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