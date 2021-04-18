import * as React from 'react';
import {Checkbox, Input} from "../Atoms";
import {OptionRow, OptionsSection, SettingOption} from "./Shared";
import {Container} from "../Infrastructure";

export function DisplayCard() {
    const container = Container.factory();
    const browser = container.browser;
    const config = container.configuration;
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