import * as React from 'react';
import {Dropdown} from "../Atoms";
import {OptionRow, OptionsSection, SettingOption} from "./Shared";
import {useProvider} from "../Infrastructure";

type Props = { setTheme: React.Dispatch<React.SetStateAction<string>> }

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
    const {themeConfiguration} = useProvider()
    const theme = themeConfiguration.theme;

    return <OptionsSection title="Theme">
        <OptionRow>
            <SettingOption title="Color theme">
                <Dropdown value={theme.value} onChange={async value => (await theme.setAndSaveValue(value)) && props.setTheme(value)}
                          options={options}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}