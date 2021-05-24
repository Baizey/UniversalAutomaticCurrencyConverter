import {themes, useProvider} from '../../../infrastructure';
import {OptionRow, OptionsSection, SettingOption} from '../Shared';
import {Dropdown} from '../../atoms';
import * as React from 'react';
import {VisualCardProps} from './VisualsCard';

const themeOptions = Object.entries(themes).map(([key]) => ({
    value: key,
    label: [key.replace(/[A-Z]/g, (e) => ` ${e}`)]
        .map(e => e[0].toUpperCase() + e.substr(1, e.length).toLowerCase())[0]
}))

export function ThemeCard(props: VisualCardProps) {
    const {colorTheme} = useProvider()
    return <OptionsSection title="Theme">
        <OptionRow key="visual_theme">
            <SettingOption title="Color theme">
                <Dropdown value={colorTheme.value as string}
                          onChange={async value => (await colorTheme.setAndSaveValue(value as keyof typeof themes)) && props.setTheme(value as keyof typeof themes)}
                          options={themeOptions}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}