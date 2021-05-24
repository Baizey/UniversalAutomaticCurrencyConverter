import * as React from 'react';
import {useEffect, useState} from 'react';
import Select from 'react-select';
import {MyTheme, useProvider} from '../../infrastructure';
import {asPixel, FieldHeight} from './Constants';
import {basicStyle} from './Basics';
import {useTheme} from 'styled-components';

export type DropdownProps = {
    maxOptions?: number
    options: { label: string, value: string }[],
    value?: string,
    onChange: (value: string) => void
}

export function Dropdown({options, value, onChange, maxOptions}: DropdownProps) {
    const [selected, setSelected] = useState<{ label: string, value: string } | null>(null);
    useEffect(() => setSelected(options.filter(e => e.value === value)[0]), [])
    const theme = useTheme() as MyTheme
    const visibleOptions = (maxOptions || 4)
    const optionHeight = 40;
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
                ...basicStyle({theme: theme}),
                width: '100%',
                height: asPixel(FieldHeight),
                lineHeight: asPixel(FieldHeight),
                verticalAlign: 'center',
                backgroundColor: state.isFocused ? theme.backgroundBorderFocus : theme.containerBackground,
                cursor: 'pointer',
            }),
            placeholder: (provided: any) => ({
                ...provided,
                ...basicStyle({theme: theme}),
                width: '100%',
                height: asPixel(FieldHeight),
                lineHeight: asPixel(FieldHeight),
                color: theme.headerText,
            }),
            singleValue: (provided: any, state: any) => ({
                ...provided,
                ...basicStyle({theme: theme}),
                height: asPixel(FieldHeight),
                lineHeight: asPixel(FieldHeight),
                width: '100%',
                maxWidth: '100%',
            }),
            valueContainer: (provided: any, state: any) => ({
                ...provided,
                ...basicStyle({theme: theme}),
                height: asPixel(FieldHeight),
                lineHeight: asPixel(FieldHeight),
                borderBottomWidth: '1px',
                borderBottomColor: state.isFocused ? theme.formBorderFocus : theme.formBorder,
                transition: 'border-color 0.3s ease-in-out',
                '&:hover': {
                    borderBottomColor: theme.formBorderFocus
                },
            }),
            input: (provided: any) => ({
                ...provided,
                ...basicStyle({theme: theme}),
                height: asPixel(FieldHeight),
                lineHeight: asPixel(FieldHeight),
            }),
            control: (provided: any, state: any) => ({
                ...provided,
                ...basicStyle({theme: theme}),
                height: asPixel(FieldHeight),
                lineHeight: asPixel(FieldHeight),
                cursor: 'pointer'
            }),
            menu: (provided: any, state: any) => ({
                ...provided,
                ...basicStyle({theme: theme}),
                borderWidth: '1px',
                maxHeight: (visibleOptions * optionHeight) + 'px'
            }),
            menuList: (provided: any, state: any) => ({
                ...provided,
                ...basicStyle({theme: theme}),
                maxHeight: (visibleOptions * optionHeight) + 'px'
            }),
            container: (provided: any, state: any) => ({
                ...provided,
                ...basicStyle({theme: theme}),
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