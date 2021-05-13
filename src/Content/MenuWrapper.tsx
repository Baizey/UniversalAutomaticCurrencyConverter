import styled from 'styled-components';
import * as React from 'react'
import {useEffect, useState} from 'react'
import {ThemeProps} from '../Atoms/ThemeProps';
import {TabMessage, TabMessageType, useProvider} from '../Infrastructure';
import {TitleAlert} from './TitleAlert';
import {LocalizationAlert} from './LocalizationAlert';
import {MenuAlert} from './MenuAlert';
import {CurrencyElement} from '../CurrencyConverter/Currency/CurrencyElement';
import {BasicPage} from '../Atoms';

type Props = {
    conversions: CurrencyElement[]
}

export function MenuWrapper(props: Props) {
    const {activeLocalization} = useProvider();

    const [showLocalization, setShowLocalization] = useState(activeLocalization.hasConflict())
    const [showMenu, setShowMenu] = useState(true);

    useEffect(() => {
        chrome.runtime.onMessage.addListener(async function (data: TabMessage, sender, senderResponse) {
            switch (data.type) {
                case TabMessageType.openContextMenu:
                    setShowMenu(true);
            }
            senderResponse({success: true});
            return true;
        });
    }, [])

    return <BasicPage>
        <Container>
            <TitleAlert/>
            {showLocalization ? <LocalizationAlert setDismissed={() => setShowLocalization(false)}/> : <></>}
            {showMenu ? <MenuAlert setDismissed={() => setShowMenu(false)}/> : <></>}
        </Container>
    </BasicPage>
}

const Container = styled.div`
  font-family: Arial, sans-serif;
  width: 100%;
  border-radius: 5px;
  height: fit-content;

  & > div {
    border-width: 1px;
    border-color: ${(props: ThemeProps) => props.theme.containerBorder};
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