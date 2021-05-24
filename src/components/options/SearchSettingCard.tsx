import * as React from 'react';
import {OptionRow, OptionsSection, SettingOption} from "./Shared";
import {StyledInput} from '../atoms';

type Props = { onChange: (value: string) => void }

export function SearchSettingCard(props: Props) {
    return <OptionsSection title="Search for setting">
        <OptionRow>
            <SettingOption title="">
                <StyledInput type="text"
                             defaultValue=""
                             placeholder="Search here..."
                             onChange={value => props.onChange(value as string)}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}