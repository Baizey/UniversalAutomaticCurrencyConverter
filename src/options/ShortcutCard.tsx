import * as React from 'react';
import {OptionRow, OptionsSection, SettingOption} from "./Shared";
import {Container} from "../Infrastructure";
import {Shortcut} from "../Atoms/Shortcut";

export function ShortcutCard() {
    const container = Container.factory();
    const config = container.configuration;
    const convertHover = config.shortcut.convertHover;
    const convertAll = config.shortcut.convertAll;

    return <OptionsSection title="Shortcuts">
        <OptionRow>
            <SettingOption title="Convert-hovered shortcut"
                           help={"Left-click, then click your desired shortcut key"}>
                <Shortcut
                    defaultValue={convertHover.value}
                    onChange={value => convertHover.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Convert-all shortcut"
                           help={"Left-click, then click your desired shortcut key"}>
                <Shortcut
                    defaultValue={convertAll.value}
                    onChange={value => convertAll.setAndSaveValue(value)}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}