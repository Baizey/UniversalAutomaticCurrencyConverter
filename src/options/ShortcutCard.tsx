import * as React from 'react';
import {OptionRow, OptionsSection, SettingOption} from "./Shared";
import {useProvider} from "../Infrastructure";
import {Shortcut} from "../Atoms/Shortcut";

export function ShortcutCard() {
    const {configurationShortcut} = useProvider()
    const convertHover = configurationShortcut.convertHover;
    const convertAll = configurationShortcut.convertAll;

    return <OptionsSection title="Shortcuts">
        <OptionRow>
            <SettingOption title="Convert-hovered shortcut"
                           help={"Left-click, then click your desired shortcut key, right-click to remove shortcut"}>
                <Shortcut
                    defaultValue={convertHover.value}
                    onChange={value => convertHover.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Convert-all shortcut"
                           help={"Left-click, then click your desired shortcut key, right-click to remove shortcut"}>
                <Shortcut
                    defaultValue={convertAll.value}
                    onChange={value => convertAll.setAndSaveValue(value)}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}