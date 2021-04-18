import * as React from 'react';
import {Checkbox, Dropdown, Input} from "../Atoms";
import {OptionRow, OptionsSection, SettingOption} from "./Shared";
import {Browser, Configuration, Container, IBrowser} from "../Infrastructure";
import {Shortcut} from "../Atoms/Shortcut";

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
    const container = Container.factory();
    const config = container.configuration;
    const decimal = config.display.decimal;
    const thousands = config.display.thousands;
    const rounding = config.display.rounding;

    return <OptionsSection title="Number formatting">
        <OptionRow>
            <SettingOption title="Thousands">
                <Dropdown options={thousandsOptions} value={thousands.value}
                          onChange={value => thousands.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Decimal">
                <Dropdown options={commaOptions} value={decimal.value}
                          onChange={value => decimal.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Important digits">
                <Input type="number" value={rounding.value} onChange={value => rounding.setAndSaveValue(+value)}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}