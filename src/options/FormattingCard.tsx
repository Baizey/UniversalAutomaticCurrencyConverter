import * as React from 'react';
import {Dropdown, Input} from "../Atoms";
import {OptionRow, OptionsSection, SettingOption} from "./Shared";
import {useProvider} from '../Infrastructure';

const thousandsOptions = [
    {value: ' ', label: '100 000 (space)'},
    {value: ',', label: '100,000 (comma)'},
    {value: '.', label: '100.000 (dot)'},
    {value: '', label: '100000 (nothing)'},
]

const commaOptions = [
    {value: ',', label: '0,50 (comma)'},
    {value: '.', label: '0.50 (dot)'},
]

export function FormattingCard() {
    const {decimalPoint, thousandsSeparator, significantDigits} = useProvider()

    return <OptionsSection title="Number formatting">
        <OptionRow>
            <SettingOption title="Thousands">
                <Dropdown options={thousandsOptions} value={thousandsSeparator.value}
                          onChange={value => thousandsSeparator.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Decimal">
                <Dropdown options={commaOptions} value={decimalPoint.value}
                          onChange={value => decimalPoint.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Important digits">
                <Input type="number" value={significantDigits.value}
                       onChange={value => significantDigits.setAndSaveValue(+value)}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}