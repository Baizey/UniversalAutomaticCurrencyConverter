import * as React from 'react';
import {Checkbox} from "../Atoms";
import {OptionRow, OptionsSection, SettingOption} from "./Shared";
import {Browser, Configuration, IBrowser} from "../Infrastructure";
import {Shortcut} from "../Atoms/Shortcut";

export function AccessibilityCard(injection: { browser?: IBrowser, config?: Configuration }) {
    const browser = injection.browser || Browser.instance();
    const config = injection.config || Configuration.instance();
    const hover = config.utility.hover;
    const click = config.utility.click;
    const autoConvert = config.utility.using;
    const shortcut = config.utility.shortcut;

    return <OptionsSection title="Accessibility">
        <OptionRow>
            <SettingOption title="Hover and click shortcut to convert"
                           help={"Left click on it and then click your desired keyboard shortcut, then leftclick outside the box"}>
                <Shortcut
                    defaultValue={shortcut.value}
                    onChange={value => shortcut.setAndSaveValue(value)}/>
            </SettingOption>
        </OptionRow>
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