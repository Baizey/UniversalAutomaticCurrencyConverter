import * as React from 'react';
import {OptionRow, OptionsSection, SettingOption} from "../Shared";
import {useProvider} from '../../../infrastructure';
import {Checkbox, Dropdown} from '../../atoms';

const dollarOptions = [
    {value: 'USD', label: 'American'},
    {value: 'CAD', label: 'Canadian'},
    {value: 'AUD', label: 'Australian'},
    {value: 'MXN', label: 'Mexican'},
    {value: 'NZD', label: 'New Zealand'},
    {value: 'SGP', label: 'Singapore'},
    {value: 'HKD', label: 'Hong kong'},
];

const kroneOptions = [
    {value: 'SEK', label: 'Swedish'},
    {value: 'DKK', label: 'Danish'},
    {value: 'NOK', label: 'Norwegian'},
    {value: 'ISK', label: 'Icelandic'},
    {value: 'CZK', label: 'Czechia'},
]

const yenOptions = [
    {value: 'CNY', label: 'Chinese'},
    {value: 'JPY', label: 'Japanese'},
]

export type CurrencyCardProps = { symbols: { label: string, value: string }[] }

export function CurrencyCard(props: CurrencyCardProps) {
    const {
        usingLocalizationAlert,
        kroneLocalization,
        yenLocalization,
        dollarLocalization,
        showConversionInBrackets,
        convertTo
    } = useProvider()

    return <OptionsSection title="Currency settings">
        <OptionRow key="convert_to_row">
            <SettingOption key="convert_to_option" title="Convert to">
                <Dropdown
                    options={props.symbols}
                    value={convertTo.value}
                    onChange={value => convertTo.setAndSaveValue(value)}/>
            </SettingOption>
        </OptionRow>

        <OptionRow key="brackets_row">
            <SettingOption key="brackets_option" title="Display conversion in brackets beside original price">
                <Checkbox value={showConversionInBrackets.value}
                          onChange={value => showConversionInBrackets.setAndSaveValue(value)}/>
            </SettingOption>
        </OptionRow>

        <OptionRow>
            <SettingOption title="Show localization alerts">
                <Checkbox
                    value={usingLocalizationAlert.value}
                    onChange={value => usingLocalizationAlert.setAndSaveValue(value)}/>
            </SettingOption>
        </OptionRow>

        <OptionRow>
            <SettingOption title="Dollar$">
                <Dropdown options={dollarOptions} value={dollarLocalization.value}
                          onChange={value => dollarLocalization.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Kr.">
                <Dropdown options={kroneOptions} value={kroneLocalization.value}
                          onChange={value => kroneLocalization.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="¥en">
                <Dropdown options={yenOptions} value={yenLocalization.value}
                          onChange={value => yenLocalization.setAndSaveValue(value)}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}