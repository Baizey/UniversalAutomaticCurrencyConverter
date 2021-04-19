import * as React from 'react';
import {Checkbox, Input} from "../Atoms";
import {OptionRow, OptionsSection, SettingOption} from "./Shared";
import {useContainer} from "../Infrastructure";

export function HighlightCard() {
    const {configurationHighlight} = useContainer()
    const color = configurationHighlight.color;
    const using = configurationHighlight.using;
    const duration = configurationHighlight.duration;

    return <OptionsSection title="Conversion highlighting">
        <OptionRow>
            <SettingOption title="Highlight conversions">
                <Checkbox value={using.value}
                          onChange={value => using.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Color" help={"Allows oth names and HEX"}>
                <Input type={"text"} value={color.value}
                       onChange={value => color.setAndSaveValue(`${value}`)}/>
            </SettingOption>
            <SettingOption title="Duration" help={"1000 = 1 second"}>
                <Input type="number" value={duration.value}
                       onChange={value => duration.setAndSaveValue(+value)}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}