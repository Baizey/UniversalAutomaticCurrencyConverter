import * as React from 'react';
import { Meta, Story } from '@storybook/react';
import PopupApp, { PopupAppProps } from '../../components/popup/PopupApp';
import { SelfStartingPage } from '../../components/atoms';

export default {
  title: 'popup/App',
  component: PopupApp,
} as Meta;

const Template: Story = (args) => <PopupApp {...(args as PopupAppProps)} />;

export const app = Template.bind({});
app.args = { isLoading: false } as PopupAppProps;

const SelfStartingTemplate: Story = (args) => (
  <SelfStartingPage Child={PopupApp} />
);
export const selfStarting = SelfStartingTemplate.bind({});
