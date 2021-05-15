import styled, {ThemeProvider} from 'styled-components';
import * as React from 'react'
import {useEffect, useState} from 'react'
import {TabMessage, TabMessageType, useProvider} from '../Infrastructure';
import {TitleAlert} from './TitleAlert';
import {LocalizationAlert} from './LocalizationAlert';
import {MenuAlert} from './MenuAlert';
import {ThemeProps} from '../Infrastructure/Theme';


export function ContentApp() {
    const {activeLocalization, theme, browser} = useProvider();

    const [showLocalization, setShowLocalization] = useState(activeLocalization.hasConflict())
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        browser.runtime.onMessage.addListener(async function (data: TabMessage, sender, senderResponse) {
            switch (data.type) {
                case TabMessageType.openContextMenu:
                    setShowMenu(true);
            }
            senderResponse({success: true});
            return true;
        });
    }, [])

    return <ThemeProvider theme={theme}>
        <Container>
            <TitleAlert/>
            {showLocalization ? <LocalizationAlert
                key="uacc-alert-localization"
                setDismissed={() => setShowLocalization(false)}/> : <></>}
            {showMenu ? <MenuAlert
                key="uacc-alert-menu"
                setDismissed={() => setShowMenu(false)}/> : <></>}
        </Container>
    </ThemeProvider>
}

const Container = styled.div<ThemeProps>`
  font-family: Arial, sans-serif;
  width: 100%;
  border-radius: 5px;
  height: fit-content;

  & > div {
    border-width: 1px;
    border-color: ${props => props.theme.containerBorder};
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