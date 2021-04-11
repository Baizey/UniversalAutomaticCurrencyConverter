import * as React from 'react';
import {Checkbox, Dropdown} from "../Atoms";
import {OptionRow, OptionsSection, SettingOption} from "./Shared";

export function CurrencyCard() {
    return <OptionsSection title="Conversion">
        <OptionRow>
            <SelectCurrency/>
        </OptionRow>
        <OptionRow>
            <CheckUseBrackets/>
        </OptionRow>
    </OptionsSection>
}

function SelectCurrency() {
    return <SettingOption title={"Convert to"}>
        <Dropdown options={[]} onChange={() => {
        }}/>
    </SettingOption>
}

function CheckUseBrackets() {
    return <SettingOption title={"Display conversion in brackets beside original price"}>
        <Checkbox initialValue={false} onChange={() => {
        }}/>
    </SettingOption>
}