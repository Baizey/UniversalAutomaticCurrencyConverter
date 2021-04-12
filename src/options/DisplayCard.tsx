import * as React from 'react';
import {Checkbox, Dropdown, Input} from "../Atoms";
import {OptionRow, OptionsSection, SettingOption} from "./Shared";
import {Browser, Configuration, IBrowser} from "../Infrastructure";
import {Shortcut} from "../Atoms/Shortcut";

export function DisplayCard(injection: { browser?: IBrowser, config?: Configuration }) {
    const browser = injection.browser || Browser.instance();
    const config = injection.config || Configuration.instance();
    const display = config.tag.display;
    const using = config.tag.using;
    const rate = config.tag.value;

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