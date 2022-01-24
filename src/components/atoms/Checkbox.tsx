import styled from 'styled-components';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ThemeProps } from '../../infrastructure';
import { Div } from './Basics';

export type CheckboxProps = {
  value: boolean;
  onChange: (value: boolean) => void;
};

export function Checkbox({ value, onChange }: CheckboxProps) {
  const [isChecked, setIsChecked] = useState(value);
  useEffect(() => onChange(isChecked), [isChecked]);

  return (
    <Container checked={isChecked} onClick={() => setIsChecked(!isChecked)}>
      <div />
      <div />
    </Container>
  );
}

type ContainerProps = { checked: boolean; onClick: () => void } & ThemeProps;
const Container = styled(Div)<ContainerProps>`
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-width: 1px;
  position: relative;
  display: block;

  &:hover {
    transition: border-color 0.3s ease-in-out;
    border-color: ${({ theme }: ThemeProps) => theme.formBorderFocus};
  }

  & div {
    position: absolute;
    height: 5px;
    background-color: ${(props: ThemeProps) => props.theme.successBackground};
    transition: opacity 0.3s ease-in-out;
    opacity: ${(props) => (props.checked ? 1 : 0)};
  }

  & div:first-child {
    margin-top: 15px;
    margin-left: 0;
    width: 16px;
    transform: rotate(45deg);
  }

  & div:last-child {
    margin-top: 14px;
    margin-left: 9px;
    width: 20px;
    transform: rotate(135deg);
  }
`;
