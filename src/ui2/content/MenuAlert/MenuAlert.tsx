import {PropsWithChildren, useEffect, useState} from 'preact/compat'
import {CompactCurrencyLocalization} from '../../../currencyConverter/Localization/ActiveLocalization'
import {useProvider} from '../../../di'
import {ButtonGrid, ErrorButton, HeaderText, SuccessButton, Text, useTheme} from '../../atoms'
import {Dropdown, DropdownListLocation, DropdownOption, Range} from '../../molecules'
import {OptionRow, SettingOption} from '../../options/shared'
import {AlertSection} from '../AlertSection'
import {Div} from "@baizey/styled-preact";
import {useSignal} from "@preact/signals";

type Props = { setDismissed: () => void };

const dollarOptions: DropdownOption[] = [
    {
        key: 'USD',
        text: 'American',
    },
    {
        key: 'CAD',
        text: 'Canadian',
    },
    {
        key: 'AUD',
        text: 'Australian',
    },
    {
        key: 'MXN',
        text: 'Mexican',
    },
    {
        key: 'NZD',
        text: 'New Zealand',
    },
    {
        key: 'SGP',
        text: 'Singapore',
    },
    {
        key: 'HKD',
        text: 'Hong kong',
    },
    {
        key: 'ARS',
        text: 'Argentine',
    },
]

const kroneOptions: DropdownOption[] = [
    {
        key: 'SEK',
        text: 'Swedish',
    },
    {
        key: 'DKK',
        text: 'Danish',
    },
    {
        key: 'NOK',
        text: 'Norwegian',
    },
    {
        key: 'ISK',
        text: 'Icelandic',
    },
    {
        key: 'CZK',
        text: 'Czechia',
    },
]

const yenOptions: DropdownOption[] = [
    {
        key: 'CNY',
        text: 'Chinese',
    },
    {
        key: 'JPY',
        text: 'Japanese',
    },
]

function ConversionsCount() {
    const {tabState} = useProvider()
    if (!tabState.isAllowed) return <Text>Site is blacklisted</Text>

    const [showing, setShowing] = useState(tabState.isShowingConversions)
    useEffect(() => {
        tabState.setIsShowingConversions(showing)
    }, [showing])

    const ConvertButton = showing
        ? <ErrorButton onClick={() => setShowing(false)}>
            Hide conversions
        </ErrorButton>
        : <SuccessButton onClick={() => setShowing(true)}>
            Show conversions
        </SuccessButton>

    return (
        <>
            <OptionRow>
                <SettingOption title="Conversions">
                    <Text>{tabState.conversions.length} conversions</Text>
                </SettingOption>
            </OptionRow>
            <OptionRow>
                <SettingOption title="">
                    <ButtonGrid>{ConvertButton}</ButtonGrid>
                </SettingOption>
            </OptionRow>
        </>
    )
}

function PageLocalization() {
    const {
        activeLocalization,
        tabState,
    } = useProvider()

    async function changePageLocalization(
        compact: Partial<CompactCurrencyLocalization>,
    ) {
        await activeLocalization.overload(compact)
        await activeLocalization.save()
        await tabState.updateDisplay()
    }

    return (
        <OptionRow>
            <SettingOption title="Dollar$">
                <Dropdown
                    listLocation={DropdownListLocation.top}
                    options={dollarOptions}
                    initialValue={activeLocalization.dollar.value}
                    onSelection={async (value) =>
                        await changePageLocalization({dollar: value})
                    }
                />
            </SettingOption>
            <SettingOption title="Kr.">
                <Dropdown
                    listLocation={DropdownListLocation.top}
                    options={kroneOptions}
                    initialValue={activeLocalization.krone.value}
                    onSelection={async (value) =>
                        await changePageLocalization({krone: value})
                    }
                />
            </SettingOption>
            <SettingOption title="¥en">
                <Dropdown
                    listLocation={DropdownListLocation.top}
                    options={yenOptions}
                    initialValue={activeLocalization.yen.value}
                    onSelection={async (value) =>
                        await changePageLocalization({yen: value})
                    }
                />
            </SettingOption>
        </OptionRow>
    )
}

function ConvertTo() {
    const {
        backendApi,
        currencyTagConfig: {convertTo},
        tabState,
        logger,
    } = useProvider()
    const [symbols, setSymbols] = useState<DropdownOption[]>([])
    useEffect(() => {
        backendApi.symbols().then((raw) =>
            setSymbols(
                Object.entries(raw).map(([k, v]) => ({
                    key: k,
                    text: `${v} (${k})`,
                })),
            ),
        )
    }, [])

    if (symbols.length === 0) {
        return (
            <OptionRow>
                <SettingOption title="Convert to">
                    <Text>Loading...</Text>
                </SettingOption>
            </OptionRow>
        )
    }

    return (
        <OptionRow>
            <SettingOption title="Convert to">
                <Dropdown
                    listLocation={DropdownListLocation.top}
                    options={symbols}
                    initialValue={convertTo.value}
                    onSelection={async (value) => {
                        if (await convertTo.setAndSaveValue(value)) {
                            logger.info(`Now converting to ${value}`)
                            await tabState.updateDisplay(value)
                        }
                    }}
                />
            </SettingOption>
        </OptionRow>
    )
}

function Allowance() {
    const {
        browser,
        siteAllowance,
    } = useProvider()
    const host: string = browser.url.hostname
    const path: string = browser.url.pathname
    const hostParts = host
        .split('.')
        .filter((e: string) => e !== 'www')
        .reverse()
    const pathParts = path.split('/').filter((e) => e)

    const uri = useSignal(`${hostParts.map((e) => e).reverse().join('.')}${pathParts.length > 0 ? '/' : ''}${pathParts.join('/')}`)

    const [isAllowed, setIsAllowed] = useState(
        siteAllowance.getAllowance(uri.value).isAllowed,
    )

    const options: any[] = []
    while (hostParts.length + pathParts.length > 1) {
        const uri = `${hostParts
            .map((e) => e)
            .reverse()
            .join('.')}${pathParts.length > 0 ? '/' : ''}${pathParts.join('/')}`
        options.unshift(uri)
        if (pathParts.length > 0) {
            pathParts.pop()
        } else {
            hostParts.pop()
        }
    }

    const AllowanceButton = isAllowed ? (
        <ErrorButton
            onClick={() => {
                siteAllowance.addUri(uri.value, false).finally(() => setIsAllowed(false))
            }}
        >
            Blacklist
        </ErrorButton>
    ) : (
        <SuccessButton
            onClick={() => {
                siteAllowance.addUri(uri.value, true).finally(() => setIsAllowed(true))
            }}
        >
            Whitelist
        </SuccessButton>
    )

    return (
        <>
            <OptionRow key="menu-alert-section-allowance-range">
                <SettingOption
                    key="menu-alert-option-allowance-range"
                    title="Site allowance"
                >
                    <Range
                        key="menu-alert-allowance-range"
                        options={options}
                        initialValue={uri.value}
                        onChange={(e) => {
                            uri.value = e
                            setIsAllowed(siteAllowance.getAllowance(e).isAllowed)
                        }}
                    />
                </SettingOption>
            </OptionRow>
            <OptionRow>
                <SettingOption title="">{AllowanceButton}</SettingOption>
            </OptionRow>
        </>
    )
}

export function MenuAlert({setDismissed}: Props) {
    return (
        <AlertSection onDismiss={setDismissed} title="Context menu">
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
    )
}

function Section(props: PropsWithChildren) {
    return <Div {...props} style={{
        width: '100%',
        textAlign: 'center',
        color: useTheme().normalText,
        display: 'flex',
        flexDirection: 'column',
    }}/>
}