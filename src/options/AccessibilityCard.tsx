import * as React from 'react';
import {Checkbox} from "../Atoms";
import {OptionRow, OptionsSection, SettingOption} from "./Shared";
import {useProvider} from "../Infrastructure";

export function AccessibilityCard() {
    const {configurationUtility} = useProvider()
    const hover = configurationUtility.hover;
    const click = configurationUtility.click;
    const autoConvert = configurationUtility.using;

    return <OptionsSection title="Accessibility">
        <OptionRow>
            <SettingOption title="Convert pages automatically on load">
                <Checkbox value={autoConvert.value} onChange={value => autoConvert.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Convert prices by left clicking">
                <Checkbox value={click.value} onChange={value => click.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Convert prices on hover over">
                <Checkbox value={hover.value} onChange={value => hover.setAndSaveValue(value)}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}