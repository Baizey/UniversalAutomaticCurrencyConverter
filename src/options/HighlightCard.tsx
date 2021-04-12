import * as React from 'react';
import {Checkbox, Dropdown, Input} from "../Atoms";
import {OptionRow, OptionsSection, SettingOption} from "./Shared";
import {Browser, Configuration, IBrowser} from "../Infrastructure";
import {Shortcut} from "../Atoms/Shortcut";

export function HighlightCard(injection: { browser?: IBrowser, config?: Configuration }) {
    const browser = injection.browser || Browser.instance();
    const config = injection.config || Configuration.instance();
    const color = config.highlight.color;
    const using = config.highlight.using;
    const duration = config.highlight.duration;

    return <OptionsSection title="Number formatting">
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