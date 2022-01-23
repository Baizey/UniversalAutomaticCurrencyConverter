import {AlertSection} from './AlertSection';
import * as React from 'react'
import styled from 'styled-components';
// noinspection ES6UnusedImports We need to import everything for it to work in browser
import {RadioBox, RadioBoxContainer, RadioBoxContainerProps, RadioBoxProps} from '../atoms/RadioBox';
// noinspection ES6UnusedImports We need to import everything for it to work in browser
import {
    Button,
    ButtonProps,
    Div,
    Dropdown,
    HeaderText,
    NormalText,
    ReadonlyInput,
    Space,
    SpaceProps, Input,
    Title,
    Range,
} from '../atoms';
import {ThemeProps, useProvider} from '../../infrastructure';
import {OptionRow, SettingOption} from "../options/Shared";
import {useEffect, useState} from "react";
import {CompactCurrencyLocalization} from "../../currencyConverter/Localization/ActiveLocalization";

type Props = { setDismissed: () => void }

const dollarOptions = [
    {value: 'USD', label: 'American'},
    {value: 'CAD', label: 'Canadian'},
    {value: 'AUD', label: 'Australian'},
    {value: 'MXN', label: 'Mexican'},
    {value: 'NZD', label: 'New Zealand'},
    {value: 'SGP', label: 'Singapore'},
    {value: 'HKD', label: 'Hong kong'},
    {value: 'ARS', label: 'Argentine'},
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

function ConversionsCount() {
    const {tabState} = useProvider();
    if (!tabState.isAllowed) return <NormalText>Site is blacklisted</NormalText>

    const [showing, setShowing] = useState(tabState.isShowingConversions);
    useEffect(() => {
        tabState.setIsShowingConversions(showing)
    }, [showing])

    const ConvertButton = showing
        ? <Button onClick={() => {
            setShowing(false)
        }} error>Hide conversions</Button>
        : <Button onClick={() => {
            setShowing(true)
        }} success>Show conversions</Button>

    return <>
        <OptionRow>
            <SettingOption title="Conversions">
                <NormalText>
                    {tabState.conversions.length} conversions
                </NormalText>
            </SettingOption>
        </OptionRow>
        <OptionRow>
            <SettingOption title="">
                {ConvertButton}
            </SettingOption>
        </OptionRow>
    </>
}

function PageLocalization() {
    const {activeLocalization, tabState} = useProvider();

    async function changePageLocalization(compact: Partial<CompactCurrencyLocalization>) {
        await activeLocalization.overload(compact)
        await activeLocalization.save()
        await tabState.updateDisplay()
    }

    return <OptionRow>
        <SettingOption title="Dollar$">
            <Dropdown
                menuPlacement="top"
                options={dollarOptions} value={activeLocalization.dollar.value}
                onChange={async value => await changePageLocalization({dollar: value})}/>
        </SettingOption>
        <SettingOption title="Kr.">
            <Dropdown
                menuPlacement="top"
                options={kroneOptions} value={activeLocalization.krone.value}
                onChange={async value => await changePageLocalization({krone: value})}/>
        </SettingOption>
        <SettingOption title="¥en">
            <Dropdown
                menuPlacement="top"
                options={yenOptions} value={activeLocalization.yen.value}
                onChange={async value => await changePageLocalization({yen: value})}/>
        </SettingOption>
    </OptionRow>
}

function ConvertTo() {
    const {backendApi, convertTo, tabState, logger} = useProvider()
    const [symbols, setSymbols] = useState<{ label: string, value: string }[]>([]);
    useEffect(() => {
        backendApi.symbols()
            .then(raw => setSymbols(Object.entries(raw)
                .map(([k, v]) => ({value: k, label: `${v} (${k})`}))))
    }, [])

    if (symbols.length === 0) return <OptionRow>
        <SettingOption title="Convert to">
            <NormalText>Loading...</NormalText>
        </SettingOption>
    </OptionRow>

    return <OptionRow>
        <SettingOption title="Convert to">
            <Dropdown
                menuPlacement="top"
                options={symbols}
                value={convertTo.value}
                onChange={async value => {
                    if (await convertTo.setAndSaveValue(value)) {
                        logger.info(`Now converting to ${value}`)
                        await tabState.updateDisplay(value);
                    }
                }}/>
        </SettingOption>
    </OptionRow>
}

function Allowance() {
    const {browser, siteAllowance} = useProvider()
    const host = browser.url.hostname;
    const path = browser.url.pathname;
    const hostParts = host.split('.').filter(e => e !== 'www').reverse()
    const pathParts = path.split('/').filter(e => e)

    const [uri, setUri] = useState(`${hostParts.map(e => e).reverse().join('.')}${pathParts.length > 0 ? '/' : ''}${pathParts.join('/')}`)
    const [isAllowed, setIsAllowed] = useState(siteAllowance.getAllowance(uri).isAllowed)

    const options = [];
    while (hostParts.length + pathParts.length > 1) {
        const uri = `${hostParts.map(e => e).reverse().join('.')}${pathParts.length > 0 ? '/' : ''}${pathParts.join('/')}`;
        options.unshift(uri);
        if (pathParts.length > 0) pathParts.pop();
        else hostParts.pop();
    }

    const AllowanceButton = isAllowed
        ? <Button onClick={() => {
            siteAllowance.addUri(uri, false)
                .finally(() => setIsAllowed(false))
        }} error>Blacklist</Button>
        : <Button onClick={() => {
            siteAllowance
                .addUri(uri, true)
                .finally(() => setIsAllowed(true))
        }} success>Whitelist</Button>

    return <>
        <OptionRow key="menu-alert-section-allowance-range">
            <SettingOption key="menu-alert-option-allowance-range" title="Site allowance">
                <Range key="menu-alert-allowance-range"
                       options={options}
                       defaultValue={uri}
                       onChange={(e) => {
                           setUri(e);
                           setIsAllowed(siteAllowance.getAllowance(e).isAllowed)
                       }}
                />
            </SettingOption>
        </OptionRow>
        <OptionRow>
            <SettingOption title="">
                {AllowanceButton}
            </SettingOption>
        </OptionRow>
    </>
}

export function MenuAlert({setDismissed}: Props) {
    return <AlertSection onDismiss={setDismissed} title="Context menu">
        <Section>
            <Allowance/>
        </Section>
        <Section>
            <ConversionsCount/>
        </Section>
        <Section>
            <HeaderText>Current page localization</HeaderText>
            <PageLocalization/>
        </Section>
        <Section>
            <ConvertTo/>
        </Section>
    </AlertSection>
}

const Section = styled(Div)<ThemeProps>`
  width: 100%;
  text-align: center;
  color: ${(props: ThemeProps) => props.theme.normalText};
  display: flex;
  flex-direction: column;
`