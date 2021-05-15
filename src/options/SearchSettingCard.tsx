import * as React from 'react';
import {Input} from "../Atoms";
import {OptionRow, OptionsSection, SettingOption} from "./Shared";

type Props = { onChange: (value: string) => void }

export function SearchSettingCard(props: Props) {
    console.log('render')
    return <OptionsSection title="Search for setting">
        <OptionRow>
            <SettingOption title="">
                <Input type="text"
                       defaultValue=""
                       placeholder="Search here..."
                       onChange={value => props.onChange(value as string)}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}