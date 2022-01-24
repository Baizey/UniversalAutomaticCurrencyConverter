import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { FooterText, Link, NormalText, Title } from "../../components/atoms";
import { LinkProps } from "../../components/atoms/Basics";

export default {
  title: "atoms/Text",
  component: NormalText
} as Meta;

const TextTemplate: Story = (args) => <NormalText {...args} >{args.text}</NormalText>;
const SmallTextTemplate: Story = (args) => <FooterText {...args} >{args.text}</FooterText>;
const BigTextTemplate: Story = (args) => <Title {...args} >{args.text}</Title>;
const LinkTextTemplate: Story = (args) => <Link {...args as LinkProps} >{args.text}</Link>;

export const normal = TextTemplate.bind({});
normal.args = { text: "Normal" };

export const small = SmallTextTemplate.bind({});
small.args = { text: "Small" };

export const link = LinkTextTemplate.bind({ target: "", href: "" } as LinkProps);
link.args = { text: "Link" };

export const big = BigTextTemplate.bind({});
big.args = { text: "Big" };