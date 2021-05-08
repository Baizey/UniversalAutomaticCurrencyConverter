import * as React from 'react';
import {Checkbox, Input} from "../Atoms";
import {OptionRow, OptionsSection, SettingOption} from "./Shared";
import {useSettings} from '../Infrastructure/DependencyInjection';

export function DisplayCard() {
    const {customDisplay, usingCustomDisplay, customConversionRateDisplay} = useSettings()

    return <OptionsSection title="Custom display">
        <OptionRow>
            <SettingOption title="Use custom display">
                <Checkbox value={usingCustomDisplay.value}
                          onChange={value => usingCustomDisplay.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Name" help={"¤ becomes the number"}>
                <Input type={"text"} value={customDisplay.value}
                       onChange={value => customDisplay.setAndSaveValue(`${value}`)}/>
            </SettingOption>
            <SettingOption title="Conversion rate">
                <Input type="number" value={customConversionRateDisplay.value}
                       onChange={value => customConversionRateDisplay.setAndSaveValue(+value)}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}