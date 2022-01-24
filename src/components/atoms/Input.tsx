import styled from "styled-components";
import * as React from "react";
import { useState } from "react";
import { ThemeProps } from "../../infrastructure";
import { BaseInput } from "./Basics";

export type ReadonlyInputProps = {
  center?: boolean
  placeholder?: string
  defaultValue: number | string,
}

export function ReadonlyInput({ defaultValue, placeholder, center }: ReadonlyInputProps) {
  center = typeof center === "boolean" ? center : true;
  return <InputContainer
    center={center}
    type="text"
    readOnly={true}
    placeholder={placeholder}
    value={defaultValue}
  />;
}

export type InputProps = {
  type: "number" | "text" | "range"
  borderHoverColor?: string
  onChange?: (value: number | string) => void
  onEnter?: (value: number | string) => void
} & ReadonlyInputProps


export function Input({
                        type,
                        defaultValue,
                        onChange,
                        onEnter,
                        placeholder,
                        center,
                        borderHoverColor
                      }: InputProps) {
  const [current, setCurrent] = useState(defaultValue);
  center = typeof center === "boolean" ? center : true;
  return <InputContainer
    center={center}
    borderHoverColor={borderHoverColor}
    placeholder={placeholder}
    type={type}
    defaultValue={current}
    onChange={(event: any) => {
      setCurrent(event.target.value);
      onChange && onChange(event.target.value);
    }}
    onKeyUp={(event: any) => event.key === "Enter" && onEnter && onEnter(current)}
  />;
}

export type InputContainerProps =
  {
    center: boolean,
    borderHoverColor?: string,
    min?: number,
    max?: number
  }
  & ThemeProps

function align(props: InputContainerProps): "right" | "center" {
  if (props.center) return "center";
  return "right";
}

export const InputContainer = styled(BaseInput)<InputContainerProps>((props: InputContainerProps) => ({
  "&[type=\"text\"]": {
    textAlign: align(props),
    textAlignLast: align(props),
    "&:hover": {
      borderColor: props.borderHoverColor || props.theme.formBorderFocus
    },
    "&:focus": {
      outline: 0
    }
  },
  "&[type=\"number\"]": {
    textAlign: align(props),
    textAlignLast: align(props),
    "&:hover": {
      borderColor: props.borderHoverColor || props.theme.formBorderFocus
    },
    "&:focus": {
      outline: 0
    }
  }
}));