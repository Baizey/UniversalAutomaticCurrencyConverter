import * as React from "react";
import { Meta, Story } from "@storybook/react";
import PopupApp from "../../components/popup/PopupApp";
import { OptionsAppProps } from "../../components/options/OptionsApp";
import { OptionRow, OptionsSection, SettingOption } from "../../components/options/Shared";
import { Space } from "../../components/atoms";
import { SettingOptionProps } from "../../components/options/Shared/SettingOption";

export default {
  title: "options/Shared",
  component: PopupApp
} as Meta;

const OptionSectionTemplate: Story = (args) => <OptionsSection {...args}>
  <OptionRow {...args as OptionsAppProps} >
    <SettingOption title="Option 1" />
  </OptionRow>
  <Space height={80} />
</OptionsSection>;

export const optionSection = OptionSectionTemplate.bind({});
optionSection.args = { title: "Title" };

const OptionRowTemplate: Story = (args) => <>
  <OptionRow {...args as OptionsAppProps} >
    <SettingOption title="Option 1" />
  </OptionRow>
  <Space height={20} />
  <OptionRow {...args as OptionsAppProps} >
    <SettingOption title="Option 1" />
    <SettingOption title="Option 2" help="help text" />
  </OptionRow>
  <Space height={20} />
  <OptionRow {...args as OptionsAppProps} >
    <SettingOption title="Option 1" />
    <SettingOption title="Option 2" help="help text" />
    <SettingOption title="Option 3" />
  </OptionRow>
</>;

export const optionRow = OptionRowTemplate.bind({});

const SettingOptionTemplate: Story = (args) => <SettingOption {...args as SettingOptionProps} />;

export const settingOption = SettingOptionTemplate.bind({});
settingOption.args = {
  title: "Title",
  help: "Help"
};