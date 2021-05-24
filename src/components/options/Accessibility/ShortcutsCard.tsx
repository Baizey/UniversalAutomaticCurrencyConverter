import {useProvider} from '../../../infrastructure';
import {OptionRow, OptionsSection, SettingOption} from '../Shared';
import {Shortcut} from '../../atoms/Shortcut';
import * as React from 'react';

export function ShortcutsCard() {
    const {convertHoverShortcut, convertAllShortcut} = useProvider()
    return <OptionsSection title="Shortcuts">
        <OptionRow>
            <SettingOption title="Convert-hovered shortcut"
                           help={"Left-click, then click your desired shortcut key, right-click to remove shortcut"}>
                <Shortcut
                    defaultValue={convertHoverShortcut.value}
                    onChange={value => convertHoverShortcut.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Convert-all shortcut"
                           help={"Left-click, then click your desired shortcut key, right-click to remove shortcut"}>
                <Shortcut
                    defaultValue={convertAllShortcut.value}
                    onChange={value => convertAllShortcut.setAndSaveValue(value)}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}