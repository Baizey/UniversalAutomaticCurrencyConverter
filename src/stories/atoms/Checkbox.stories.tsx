import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { Checkbox } from "../../components/atoms";
import { CheckboxProps } from "../../components/atoms/Checkbox";

export default {
  title: "atoms/Checkbox",
  component: Checkbox
} as Meta;

const Template: (Story) = (args) => <Checkbox {...args as CheckboxProps} />;

export const checkbox = Template.bind({
  onChange: () => {
  }
});
checkbox.args = {
  value: true,
  onChange: () => {
  }
} as CheckboxProps;