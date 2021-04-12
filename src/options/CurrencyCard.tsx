import * as React from 'react';
import {Checkbox, Dropdown} from "../Atoms";
import {OptionRow, OptionsSection, SettingOption} from "./Shared";
import {useEffect, useState} from "react";
import {Browser, Configuration, IBrowser} from "../Infrastructure";
import {LoadingCard} from "./LoadingCard";

export function CurrencyCard(injection: { browser?: IBrowser, config?: Configuration }) {
    const browser = injection.browser || Browser.instance();
    const config = injection.config || Configuration.instance();
    const tag = config.currency.tag;
    const brackets = config.currency.showInBrackets;

    const [currency, setCurrency] = useState<string>(tag.value);
    const [checked, setChecked] = useState(brackets.value);
    const [options, setOptions] = useState<{ value: string, label: string }[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        browser.background.getSymbols()
            .then(symbols => Object.entries(symbols)
                .map(([key, value]) => ({
                        label: `${value} (${key})`,
                        value: key
                    })
                )
            ).then(resp => setOptions(resp))
            .then(() => setIsLoading(false))
    }, [])

    if (isLoading) return <LoadingCard title="Conversion"/>
    return <OptionsSection title="Conversion">
        <OptionRow>
            <SettingOption title="Convert to">
                <Dropdown
                    options={options}
                    value={currency}
                    onChange={value => tag.setAndSaveValue(value)}/>
            </SettingOption>
        </OptionRow>
        <OptionRow>
            <SettingOption title="Display conversion in brackets beside original price">
                <Checkbox value={checked} onChange={value => brackets.setAndSaveValue(value)}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}