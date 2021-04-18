import * as React from 'react';
import {Checkbox, Dropdown, Input} from "../Atoms";
import {OptionRow, OptionsSection, SettingOption} from "./Shared";
import {Browser, Configuration, Container, IBrowser} from "../Infrastructure";
import {Shortcut} from "../Atoms/Shortcut";

export function HighlightCard() {
    const container = Container.factory();
    const config = container.configuration;
    const color = config.highlight.color;
    const using = config.highlight.using;
    const duration = config.highlight.duration;

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