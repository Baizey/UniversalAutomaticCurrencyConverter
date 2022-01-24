import styled, { ThemeProvider } from 'styled-components';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { TitleAlert } from './TitleAlert';
import { LocalizationAlert } from './LocalizationAlert';
import { MenuAlert } from './MenuAlert';
import {
  mapToTheme,
  TabMessage,
  TabMessageType,
  ThemeProps,
  useProvider,
} from '../../infrastructure';
import { Div } from '../atoms';

export type ContentAppProps = {
  storyShowConflict?: boolean;
  storyShowMenu?: boolean;
};

export function ContentApp({
  storyShowConflict,
  storyShowMenu,
}: ContentAppProps = {}) {
  const { activeLocalization, browser, colorTheme, tabState } = useProvider();

  const [showLocalization, setShowLocalization] = useState<boolean>(
    activeLocalization.hasConflict() || !!storyShowConflict
  );
  const [showMenu, setShowMenu] = useState<boolean>(!!storyShowMenu);

  useEffect(() => {
    browser.runtime.onMessage.addListener(async function (
      data: TabMessage,
      sender,
      senderResponse
    ) {
      switch (data.type) {
        case TabMessageType.openContextMenu:
          setShowMenu(true);
      }
      senderResponse({ success: true });
      return true;
    });
  }, []);

  return (
    <ThemeProvider theme={mapToTheme(colorTheme.value)}>
      <Container>
        <TitleAlert />
        {showLocalization && tabState.isAllowed ? (
          <LocalizationAlert
            key="uacc-alert-localization"
            setDismissed={() => setShowLocalization(false)}
          />
        ) : (
          <></>
        )}
        {showMenu ? (
          <MenuAlert
            key="uacc-alert-menu"
            setDismissed={() => setShowMenu(false)}
          />
        ) : (
          <></>
        )}
      </Container>
    </ThemeProvider>
  );
}

const Container = styled(Div)<ThemeProps>`
  border-radius: 5px;
  height: fit-content;

  & > div {
    border-width: 1px;
    border-color: ${(props: ThemeProps) => props.theme.containerBorder};
    border-style: solid;
    width: calc(100% - 2px);
  }

  & > div:only-child {
    display: none;
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
`;
