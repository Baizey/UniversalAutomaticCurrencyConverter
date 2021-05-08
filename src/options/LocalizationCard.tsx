import * as React from 'react';
import {Checkbox, Dropdown} from "../Atoms";
import {OptionRow, OptionsSection, SettingOption} from "./Shared";
import {useProvider} from "../Infrastructure";
import {useSettings} from '../Infrastructure/DependencyInjection';

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

export function LocalizationCard() {
    const {usingLocalizationAlert, kroneLocalization, yenLocalization, dollarLocalization} = useSettings()

    return <OptionsSection title="Default Localization">
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