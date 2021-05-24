import {useProvider} from '../../../infrastructure';
import {OptionRow, OptionsSection, SettingOption} from '../Shared';
import {Checkbox, StyledInput} from '../../atoms';
import * as React from 'react';

export function HighlightCard() {
    const {usingConversionHighlighting, highlightColor, highlightDuration} = useProvider()
    return <OptionsSection title="Conversion highlight">
        <OptionRow key="visual_highlight">
            <SettingOption title="Highlight conversions">
                <Checkbox value={usingConversionHighlighting.value}
                          onChange={value => usingConversionHighlighting.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Highlight color" help={"Allows oth names and HEX"}>
                <StyledInput type={"text"} defaultValue={highlightColor.value}
                             onChange={value => highlightColor.setAndSaveValue(`${value}`)}/>
            </SettingOption>
            <SettingOption title="Highlight duration" help={"1000 = 1 second"}>
                <StyledInput type="number" defaultValue={highlightDuration.value}
                             onChange={value => highlightDuration.setAndSaveValue(+value)}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}