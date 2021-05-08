import * as React from 'react';
import {Checkbox, Input} from "../Atoms";
import {OptionRow, OptionsSection, SettingOption} from "./Shared";
import {useSettings} from '../Infrastructure/DependencyInjection';

export function HighlightCard() {
    const {highlightColor, highlightDuration, usingConversionHighlighting} = useSettings()

    return <OptionsSection title="Conversion highlighting">
        <OptionRow>
            <SettingOption title="Highlight conversions">
                <Checkbox value={usingConversionHighlighting.value}
                          onChange={value => usingConversionHighlighting.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Color" help={"Allows oth names and HEX"}>
                <Input type={"text"} value={highlightColor.value}
                       onChange={value => highlightColor.setAndSaveValue(`${value}`)}/>
            </SettingOption>
            <SettingOption title="Duration" help={"1000 = 1 second"}>
                <Input type="number" value={highlightDuration.value}
                       onChange={value => highlightDuration.setAndSaveValue(+value)}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}