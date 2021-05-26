import {useProvider} from '../../../infrastructure';
import {OptionRow, OptionsSection, SettingOption} from '../Shared';
import {Checkbox, Dropdown} from '../../atoms';
import * as React from 'react';
import {OptionCardProps} from '../OptionsApp';
import {isFilteredOut} from '../FilterOptionsCard';

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

export function LocalizationCard(props: OptionCardProps) {
    const {
        kroneLocalization,
        yenLocalization,
        dollarLocalization,
        usingLocalizationAlert
    } = useProvider()

    if (isFilteredOut(['localization', 'krone', 'dollar', 'yen'], props.filter))
        return <></>

    return <OptionsSection title="Default localization">
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

        <OptionRow key="brackets_row">
            <SettingOption title="Show localization alerts">
                <Checkbox
                    value={usingLocalizationAlert.value}
                    onChange={value => usingLocalizationAlert.setAndSaveValue(value)}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}