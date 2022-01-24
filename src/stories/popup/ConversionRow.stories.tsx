import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { ConversionRow, ConversionRowProps } from "../../components/popup/ConversionRow";

export default {
  title: "popup/Conversion Row",
  component: ConversionRow
} as Meta;

const Template: Story = (args) => <ConversionRow {...args as ConversionRowProps} >Button</ConversionRow>;

export const conversionRow = Template.bind({});
conversionRow.args = {
  from: "USD",
  to: "EUR",
  amount: 100,
  onChange: () => {
  },
  onDelete: () => {
  }
} as ConversionRowProps;