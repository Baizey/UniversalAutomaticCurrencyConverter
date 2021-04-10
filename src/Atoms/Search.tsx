import styled from "styled-components";
import * as React from 'react';
import {useState} from "react";
import SelectSearch from "react-select-search";

type Props<> = {
    options: { name: string, value: string }[]
    onChange: (value: string | number) => void
}

export default function Search({options, onChange}: Props) {
    return <SelectSearch options={options} autoComplete={"on"} onChange={(e) => {
        const value = Array.isArray(e) ? e[0].value : e.value;
        onChange(value);
    }}/>
}

type ContainerProps = {}
const Container = styled.input<ContainerProps>`
  display: block;
  width: 100%;
  height: 33px;
  padding: 0;
  font-size: 14px;
  line-height: 1.42857143;
  background-color: #0C131B;
  color: #d0d0d0;
  border: 0 solid #2F373E;
  border-bottom-width: 1px;
  border-radius: 0;
  text-align: center;
  text-align-last: center;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;;

  &:hover {
    transition: border-color 0.3s ease-in-out;
    border-color: #f0ad4e;
  }
`