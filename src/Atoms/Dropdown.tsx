import {useTheme} from "styled-components";
import * as React from 'react';
import {useEffect, useState} from 'react';
import Select from 'react-select';
import {Theme} from './Theme';

type Props = {
    options: { label: string, value: string }[],
    value?: string,
    onChange: (value: string) => void
}

export function Dropdown({options, value, onChange}: Props) {
    const [selected, setSelected] = useState<{ label: string, value: string } | null>(null);
    useEffect(() => setSelected(options.filter(e => e.value === value)[0]), [])
    const theme = useTheme() as Theme;

    return <Select
        onChange={option => {
            if(option && option.value && option.value !== selected?.value) {
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
                backgroundColor: state.isFocused ? theme.backgroundFocus : theme.containerBackground,
                cursor: 'pointer'
            }),
            placeholder: (provided: any) => ({
                ...provided,
                color: theme.subtitleText,
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
                backgroundColor: theme.containerBackground,
                borderWidth: '0px',
                borderBottomStyle: 'solid',
                height: '34px',
                borderBottomWidth: '1px',
                borderBottomColor: state.isFocused ? theme.borderFocus : theme.subtitleText,
                '&:hover': {
                    borderBottomColor: theme.borderFocus
                },
                color: theme.normalText,
                cursor: 'pointer'
            }),
            menu: (provided: any, state: any) => ({
                ...provided,
                padding: 0,
                backgroundColor: theme.containerBackground,
                borderColor: theme.subtitleText,
                borderStyle: 'solid',
                borderWidth: '1px'
            }),
            menuList: (provided: any, state: any) => ({
                ...provided,
                padding: 0,
                borderColor: theme.subtitleText,
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