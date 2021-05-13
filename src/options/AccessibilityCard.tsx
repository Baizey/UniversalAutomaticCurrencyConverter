import * as React from 'react';
import {Checkbox} from "../Atoms";
import {OptionRow, OptionsSection, SettingOption} from "./Shared";
import {useProvider} from '../Infrastructure';

export function AccessibilityCard() {
    const {usingHoverFlipConversion, usingLeftClickFlipConversion, usingAutoConversionOnPageLoad} = useProvider()

    return <OptionsSection title="Accessibility">
        <OptionRow>
            <SettingOption title="Convert pages automatically on load">
                <Checkbox value={usingAutoConversionOnPageLoad.value}
                          onChange={value => usingAutoConversionOnPageLoad.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Convert prices by left clicking">
                <Checkbox value={usingLeftClickFlipConversion.value}
                          onChange={value => usingLeftClickFlipConversion.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Convert prices on hover over">
                <Checkbox value={usingHoverFlipConversion.value}
                          onChange={value => usingHoverFlipConversion.setAndSaveValue(value)}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}