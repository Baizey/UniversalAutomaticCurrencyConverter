import styled from "styled-components";
import * as React from 'react';
import {useEffect, useState} from 'react';
import Select from 'react-select';

type Props = {
    options: { label: string, value: string }[],
    value?: string,
    onChange: (value: string) => void
}

export function Dropdown({options, value, onChange}: Props) {
    const [selected, setSelected] = useState<{ label: string, value: string } | null>(null);
    useEffect(() => setSelected(options.filter(e => e.value === value)[0]), [])

    return <Select
        onChange={option => {
            if (option && option.value && option.value !== selected?.value) {
                onChange(option.value)
                setSelected(option);
            }
        }}
        value={selected}
        options={options}
        cacheOptions
        defaultOptions
        placeholder={"Search and select..."}
        components={{DropdownIndicator: () => null, IndicatorSeparator: () => null}}
        styles={{
            option: (provided: any, state: any) => ({
                ...provided,
                backgroundColor: state.isFocused ? '#1C232B' : '#0C131B',
                cursor: 'pointer'
            }),
            placeholder: (provided: any) => ({
                ...provided,
                color: 'grey',
                fontSize: '14px',
                margin: 'auto',
                width: '100%',
                textAlign: 'center'
            }),
            singleValue: (provided: any) => ({
                ...provided,
                margin: 'auto',
                maxWidth: '100%',
                width: '100%',
                textAlign: 'center'
            }),
            valueContainer: (provided: any) => ({
                ...provided,
                width: '100%',
                fontSize: '14px',
                height: '34px',
                textAlign: 'center',
                padding: '0'
            }),
            input: (provided: any) => ({
                ...provided,
                width: '100%',
                fontSize: '14px',
                height: '34px',
                textAlign: 'center',
                padding: '0'
            }),
            control: (provided: any, state: any) => ({
                ...provided,
                backgroundColor: '#0C131B',
                borderWidth: '0px',
                borderBottomStyle: 'solid',
                height: '34px',
                borderBottomWidth: '1px',
                borderBottomColor: state.isFocused ? '#f0ad4e' : '#2F373E',
                '&:hover': {
                    borderBottomColor: '#f0ad4e'
                },
                color: '#d0d0d0',
                cursor: 'pointer'
            }),
            menu: (provided: any, state: any) => ({
                ...provided,
                padding: 0,
                backgroundColor: '#0C131B',
                borderColor: 'grey',
                borderStyle: 'solid',
                borderWidth: '1px'
            }),
            menuList: (provided: any, state: any) => ({
                ...provided,
                padding: 0,
                borderColor: 'grey',
                borderStyle: 'solid',
                borderWidth: '1px'
            }),
            container: (provided: any, state: any) => ({
                ...provided,
                border: '0px',
            })
        }}
        theme={theme => ({
            ...theme,
            borderRadius: 0,
            colors: {},
            spacing: {
                baseUnit: 10,
                controlHeight: 10,
                menuGutter: 10
            }
        })}
    />
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