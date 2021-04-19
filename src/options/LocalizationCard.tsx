import * as React from 'react';
import {Checkbox, Dropdown} from "../Atoms";
import {OptionRow, OptionsSection, SettingOption} from "./Shared";
import {useContainer} from "../Infrastructure";

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

const asianOptions = [
    {value: 'CNY', label: 'Chinese'},
    {value: 'JPY', label: 'Japanese'},
]

export function LocalizationCard() {
    const {configurationAlert, configurationLocalization} = useContainer()
    const alert = configurationAlert.localization;
    const asian = configurationLocalization.asian;
    const dollar = configurationLocalization.dollar;
    const krone = configurationLocalization.krone;

    return <OptionsSection title="Default Localization">
        <OptionRow>
            <SettingOption title="Show localization alerts">
                <Checkbox
                    value={alert.value}
                    onChange={value => alert.setAndSaveValue(value)}/>
            </SettingOption>
        </OptionRow>
        <OptionRow>
            <SettingOption title="Dollar$">
                <Dropdown options={dollarOptions} value={dollar.value}
                          onChange={value => dollar.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Kr.">
                <Dropdown options={kroneOptions} value={krone.value}
                          onChange={value => krone.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="¥en">
                <Dropdown options={asianOptions} value={asian.value}
                          onChange={value => asian.setAndSaveValue(value)}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}