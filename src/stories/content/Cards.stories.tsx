import * as React from 'react';
import { Meta, Story } from '@storybook/react';
import { LocalizationAlert } from '../../components/content/LocalizationAlert';
import { MenuAlert } from '../../components/content/MenuAlert';
import { TitleAlert } from '../../components/content/TitleAlert';
import { useProvider } from '../../infrastructure';
import { BrowserMock } from '../../../tests/Browser.mock';

export default {
  title: 'content/Alerts',
} as Meta;

const TileAlertTemplate: Story = (args) => <TitleAlert />;
export const title = TileAlertTemplate.bind({});

const LocalizationAlertTemplate: Story = (args) => {
  const { activeLocalization } = useProvider();
  activeLocalization.krone.defaultValue = 'SEK';
  activeLocalization.dollar.defaultValue = 'USD';
  activeLocalization.yen.defaultValue = 'CNY';
  if (args.kroneConflict) activeLocalization.krone.detectedValue = 'DKK';
  else
    activeLocalization.krone.detectedValue =
      activeLocalization.krone.defaultValue;
  if (args.yenConflict) activeLocalization.yen.detectedValue = 'JPY';
  else
    activeLocalization.yen.detectedValue = activeLocalization.yen.defaultValue;
  if (args.dollarConflict) activeLocalization.dollar.detectedValue = 'CAD';
  else
    activeLocalization.dollar.detectedValue =
      activeLocalization.dollar.defaultValue;
  return <LocalizationAlert setDismissed={() => {}} />;
};
export const localization = LocalizationAlertTemplate.bind({});
localization.args = {
  kroneConflict: true,
  yenConflict: true,
  dollarConflict: true,
};

type MenuAlertArgs = {
  isAllowed: true;
  conversions: 0;
};
const MenuAlertTemplate: Story = (args) => {
  const { isAllowed, conversions } = args as MenuAlertArgs;
  const { tabState, browser } = useProvider();
  if (browser instanceof BrowserMock)
    browser.setUrl(
      new URL(
        `https://www.totally.is.website.youtube.com/path/to/video/watch?v=dQw4w9WgXcQ`
      )
    );
  tabState.setIsAllowed(isAllowed);
  tabState.conversions = [];
  for (let i = 0; i < Math.min(conversions, 100); i++) {
    // @ts-ignore
    tabState.conversions.push(null);
  }
  return <MenuAlert setDismissed={() => {}} />;
};
export const menu = MenuAlertTemplate.bind({});
menu.args = {
  isAllowed: true,
  conversions: 0,
};
