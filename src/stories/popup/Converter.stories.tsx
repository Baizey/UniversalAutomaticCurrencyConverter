import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { Converter } from "../../components/popup/Converter";

export default {
  title: "popup/Converter",
  component: Converter
} as Meta;

const Template: Story = (args) => <Converter />;

export const converter = Template.bind({});