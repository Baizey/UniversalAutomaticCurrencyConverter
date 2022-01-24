import * as React from 'react';
import { Meta, Story } from '@storybook/react';
import PopupApp from '../../components/popup/PopupApp';
import OptionsApp, {
  OptionsAppProps,
} from '../../components/options/OptionsApp';
import { SelfStartingPage } from '../../components/atoms';

export default {
  title: 'options/App',
  component: PopupApp,
} as Meta;

const Template: Story = (args) => <OptionsApp {...(args as OptionsAppProps)} />;

const currencies = ['USD', 'CAD', 'EUR', 'DKK'];

export const app = Template.bind({});
app.args = {
  isLoading: false,
  setTheme: () => {},
  symbols: currencies.map((e) => ({ label: e, value: e })),
} as OptionsAppProps;

const SelfStartingTemplate: Story = (args) => (
  <SelfStartingPage Child={OptionsApp} />
);
export const selfStarting = SelfStartingTemplate.bind({});
