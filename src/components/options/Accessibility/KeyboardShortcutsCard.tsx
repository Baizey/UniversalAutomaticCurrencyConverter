import {useProvider} from '../../../infrastructure';
import {OptionRow, OptionsSection, SettingOption} from '../Shared';
import {Shortcut} from '../../atoms/Shortcut';
import * as React from 'react';
import {OptionCardProps} from '../OptionsApp';
import {isFilteredOut} from '../FilterOptionsCard';

export function KeyboardShortcutsCard(props: OptionCardProps) {
    const {convertHoverShortcut, convertAllShortcut} = useProvider()

    if (isFilteredOut(['keyboard',  'shortcut', 'hover'], props.filter))
        return <></>

    return <OptionsSection title="Keyboard shortcuts">
        <OptionRow>
            <SettingOption title="Convert-hovered shortcut"
                           help={"Left-click to clear, then click your desired shortcut key"}>
                <Shortcut
                    defaultValue={convertHoverShortcut.value}
                    onChange={value => convertHoverShortcut.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Convert-all shortcut"
                           help={"Left-click to clear, then click your desired shortcut key"}>
                <Shortcut
                    defaultValue={convertAllShortcut.value}
                    onChange={value => convertAllShortcut.setAndSaveValue(value)}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}