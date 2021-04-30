import * as React from 'react';
import {useEffect, useState} from 'react';
import {Checkbox, Dropdown} from "../Atoms";
import {OptionRow, OptionsSection, SettingOption} from "./Shared";
import {useProvider} from "../Infrastructure";
import {LoadingCard} from "./LoadingCard";
import {IBackendApi} from '../CurrencyConverter/BackendApi';

export function CurrencyCard() {
    const container = useProvider();
    const config = container.configuration;
    const backendApi: IBackendApi = container.backendApi;
    const tag = config.currency.tag;
    const brackets = config.currency.showInBrackets;

    const [currency, setCurrency] = useState<string>(tag.value);
    const [checked, setChecked] = useState(brackets.value);
    const [options, setOptions] = useState<{ value: string, label: string }[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        backendApi.symbols()
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
        <OptionRow key="convert_to_row">
            <SettingOption key="convert_to_option" title="Convert to">
                <Dropdown
                    options={options}
                    value={currency}
                    onChange={value => tag.setAndSaveValue(value)}/>
            </SettingOption>
        </OptionRow>
        <OptionRow key="brackets_row">
            <SettingOption key="brackets_option" title="Display conversion in brackets beside original price">
                <Checkbox value={checked} onChange={value => brackets.setAndSaveValue(value)}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}