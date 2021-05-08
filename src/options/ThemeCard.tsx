import * as React from 'react';
import {Dropdown} from "../Atoms";
import {OptionRow, OptionsSection, SettingOption} from "./Shared";
import {useProvider} from "../Infrastructure";
import {ThemeType} from '../Atoms/StyleTheme';

type Props = { setTheme: React.Dispatch<React.SetStateAction<ThemeType>> }

const options = [
    {
        label: 'Dark theme',
        value: 'darkTheme'
    },
    {
        label: 'Light theme',
        value: 'lightTheme'
    },
]

export function ThemeCard(props: Props) {
    const {colorTheme} = useProvider()

    return <OptionsSection title="Theme">
        <OptionRow>
            <SettingOption title="Color theme">
                <Dropdown value={colorTheme.value}
                          onChange={async value => (await colorTheme.setAndSaveValue(value as ThemeType)) && props.setTheme(value as ThemeType)}
                          options={options}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}