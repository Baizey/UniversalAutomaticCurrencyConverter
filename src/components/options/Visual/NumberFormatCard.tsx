import {useProvider} from '../../../infrastructure';
import {OptionRow, OptionsSection, SettingOption} from '../Shared';
import {Dropdown, StyledInput} from '../../atoms';
import * as React from 'react';

const thousandsOptions = [
    {value: ' ', label: '100 000 (space)'},
    {value: ',', label: '100,000 (comma)'},
    {value: '.', label: '100.000 (dot)'},
    {value: '', label: '100000 (nothing)'}
]

const commaOptions = [
    {value: ',', label: '0,50 (comma)'},
    {value: '.', label: '0.50 (dot)'}
]

export function NumberFormatCard() {
    const {decimalPoint, thousandsSeparator, significantDigits} = useProvider()
    return <OptionsSection title="Number formatting and rounding">
        <OptionRow key="visual_format">
            <SettingOption title="Thousands separator">
                <Dropdown options={thousandsOptions} value={thousandsSeparator.value}
                          onChange={value => thousandsSeparator.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Decimal point">
                <Dropdown options={commaOptions} value={decimalPoint.value}
                          onChange={value => decimalPoint.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Important digits on rounding">
                <StyledInput type="number" defaultValue={significantDigits.value}
                             onChange={value => significantDigits.setAndSaveValue(+value)}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}