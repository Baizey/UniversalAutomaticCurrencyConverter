import * as React from 'react';
import {Checkbox, Dropdown, Input} from "../../Atoms";
import {OptionRow, OptionsSection, SettingOption} from "../Shared";
import {useProvider} from "../../Infrastructure";
import {themes} from '../../Infrastructure/Theme';

type Props = { setTheme: React.Dispatch<React.SetStateAction<keyof typeof themes>> }

const themeOptions = Object.entries(themes).map(([key]) => ({
    value: key,
    label: [key.replace(/[A-Z]/g, (e) => ` ${e}`)]
        .map(e => e[0].toUpperCase() + e.substr(1, e.length).toLowerCase())[0]
}))

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

export function VisualsCard(props: Props) {
    const {
        customDisplay,
        usingCustomDisplay,
        customConversionRateDisplay,
        decimalPoint,
        thousandsSeparator,
        significantDigits,
        colorTheme,
        highlightColor,
        highlightDuration,
        usingConversionHighlighting
    } = useProvider()

    return <OptionsSection title="Visual settings">

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

        <OptionRow key="visual_highlight">
            <SettingOption title="Highlight conversions">
                <Checkbox value={usingConversionHighlighting.value}
                          onChange={value => usingConversionHighlighting.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Highlight color" help={"Allows oth names and HEX"}>
                <Input type={"text"} defaultValue={highlightColor.value}
                       onChange={value => highlightColor.setAndSaveValue(`${value}`)}/>
            </SettingOption>
            <SettingOption title="Highlight duration" help={"1000 = 1 second"}>
                <Input type="number" defaultValue={highlightDuration.value}
                       onChange={value => highlightDuration.setAndSaveValue(+value)}/>
            </SettingOption>
        </OptionRow>

        <OptionRow key="visual_display">
            <SettingOption title="Use custom display">
                <Checkbox value={usingCustomDisplay.value}
                          onChange={value => usingCustomDisplay.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Custom display" help={"¤ becomes the number"}>
                <Input type={"text"} defaultValue={customDisplay.value}
                       onChange={value => customDisplay.setAndSaveValue(`${value}`)}/>
            </SettingOption>
            <SettingOption title="Custom conversion rate">
                <Input type="number" defaultValue={customConversionRateDisplay.value}
                       onChange={value => customConversionRateDisplay.setAndSaveValue(+value)}/>
            </SettingOption>
        </OptionRow>

        <OptionRow key="visual_theme">
            <SettingOption title="Color theme">
                <Dropdown value={colorTheme.value as string}
                          onChange={async value => (await colorTheme.setAndSaveValue(value as keyof typeof themes)) && props.setTheme(value as keyof typeof themes)}
                          options={themeOptions}/>
            </SettingOption>
        </OptionRow>

    </OptionsSection>
}