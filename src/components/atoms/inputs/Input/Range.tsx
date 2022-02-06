import * as React from 'react';
import { useState } from 'react';
import { ThemeProps } from '../../../../infrastructure';
import styled from 'styled-components';
import { BaseInput } from './Input';
import { HalfFieldHeight } from '../../Constants';
import { ReadonlyInput } from './ReadonlyInput';

export type RangeProps = {
  key?: string;
  onChange: (value: string) => void;
  options: string[];
  defaultValue: string;
};

export function Range({ onChange, options, defaultValue }: RangeProps) {
  const [value, setValue] = useState(options.indexOf(defaultValue));

  return (
    <>
      <ReadonlyInput defaultValue={options[value]} />
      <RangeContainer
        value={value}
        type="range"
        step={1}
        min={0}
        max={options.length - 1}
        onChange={(event: any) => {
          setValue(event.target.value);
        }}
        onMouseUp={() => {
          onChange(options[value]);
        }}
      />
    </>
  );
}

export type RangeContainerProps = {
  min: number;
  max: number;
  step: number;
  type: string;
} & ThemeProps;
export const RangeContainer = styled(BaseInput)<RangeContainerProps>`
  -webkit-appearance: none;
  height: ${HalfFieldHeight.pixel};
  width: 80%;
  appearance: auto;
  border-width: 0;

  &[type='range'] {
    -webkit-appearance: none;
    background: transparent; /* Otherwise white in Chrome */
    display: inline-block;
    vertical-align: middle;
  }

  &[type='range']:focus {
    -webkit-appearance: none;
    outline: none;
  }

  &[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    border-radius: 10px;
    width: 20px;
    height: 20px;
    border-width: 0;
    background-color: ${(props: ThemeProps) => props.theme.headerText};

    &:hover {
      background-color: ${(props: ThemeProps) => props.theme.formBorderFocus};
    }
  }

  &[type='range']::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    width: 100%;
    padding: 0;
    margin: 0;
    height: 20px;
    border-radius: 10px;
    background-color: ${(props: ThemeProps) => props.theme.formBorder};
  }

  &[type='range']::-moz-range-thumb {
    border-radius: 10px;
    width: 20px;
    height: 20px;
    border-width: 0;
    background-color: ${(props: ThemeProps) => props.theme.headerText};

    &:hover {
      background-color: ${(props: ThemeProps) => props.theme.formBorderFocus};
    }
  }

  &[type='range']::-moz-range-track {
    width: 100%;
    height: 20px;
    border-radius: 10px;
    background-color: ${(props: ThemeProps) => props.theme.formBorder};
  }
`;
