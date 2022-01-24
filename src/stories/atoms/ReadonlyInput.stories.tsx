import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { ReadonlyInput } from "../../components/atoms";
import { ReadonlyInputProps } from "../../components/atoms/Input";

export default {
  title: "atoms/Input Readonly",
  component: ReadonlyInput
} as Meta;

const ReadOnlyInputTemplate: (Story) = (args) => <ReadonlyInput {...args as ReadonlyInputProps} />;


export const inputReadonly = ReadOnlyInputTemplate.bind({
  onChange: () => {
  }
});
inputReadonly.args = {
  center: true,
  placeholder: "placeholder",
  defaultValue: ""
} as ReadonlyInputProps;