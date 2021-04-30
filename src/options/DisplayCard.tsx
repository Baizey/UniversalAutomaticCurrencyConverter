import * as React from 'react';
import {Checkbox, Input} from "../Atoms";
import {OptionRow, OptionsSection, SettingOption} from "./Shared";
import {useProvider} from "../Infrastructure";

export function DisplayCard() {
    const {configurationTag} = useProvider()
    const display = configurationTag.display;
    const using = configurationTag.using;
    const rate = configurationTag.value;

    return <OptionsSection title="Custom display">
        <OptionRow>
            <SettingOption title="Use custom display">
                <Checkbox value={using.value}
                          onChange={value => using.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Name" help={"¤ becomes the number"}>
                <Input type={"text"} value={display.value}
                       onChange={value => display.setAndSaveValue(`${value}`)}/>
            </SettingOption>
            <SettingOption title="Conversion rate">
                <Input type="number" value={rate.value}
                       onChange={value => rate.setAndSaveValue(+value)}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}