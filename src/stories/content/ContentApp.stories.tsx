import * as React from 'react';
import { Meta, Story } from '@storybook/react';
import { ContentApp } from '../../components/content';
import { ContentAppProps } from '../../components/content/ContentApp';

export default {
  title: 'content/App',
  component: ContentApp,
} as Meta;

const Template: Story = (args) => <ContentApp {...(args as ContentAppProps)} />;

const currencies = ['USD', 'CAD', 'EUR', 'DKK'];

export const app = Template.bind({});
app.args = {
  storyShowConflict: true,
  storyShowMenu: true,
} as ContentAppProps;
