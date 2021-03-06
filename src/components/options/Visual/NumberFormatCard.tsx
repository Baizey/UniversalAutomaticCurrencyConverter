import {useProvider} from '../../../infrastructure';
import {OptionRow, OptionsSection, SettingOption} from '../Shared';
import {Dropdown, Input} from '../../atoms';
import * as React from 'react';
import {OptionCardProps} from '../OptionsApp';
import {isFilteredOut} from '../FilterOptionsCard';

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

export function NumberFormatCard(props: OptionCardProps) {
    const {decimalPoint, thousandsSeparator, significantDigits} = useProvider()

    if (isFilteredOut(['decimal', 'rounding', 'thousand', 'significant', 'digit', 'format', 'number'], props.filter))
        return <></>

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
                <Input type="number" defaultValue={significantDigits.value}
                       onChange={value => significantDigits.setAndSaveValue(+value)}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}