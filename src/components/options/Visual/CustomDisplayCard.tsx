import {useProvider} from '../../../infrastructure';
import {OptionRow, OptionsSection, SettingOption} from '../Shared';
import {Checkbox, StyledInput} from '../../atoms';
import * as React from 'react';
import {OptionCardProps} from '../OptionsApp';
import {isFilteredOut} from '../FilterOptionsCard';

export function CustomDisplayCard(props: OptionCardProps) {
    const {customDisplay, usingCustomDisplay, customConversionRateDisplay} = useProvider()

    if (isFilteredOut(['display', 'custom'], props.filter))
        return <></>

    return <OptionsSection title="Custom display">
        <OptionRow key="visual_display">
            <SettingOption title="Use custom display">
                <Checkbox value={usingCustomDisplay.value}
                          onChange={value => usingCustomDisplay.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Custom display" help={"¤ becomes the number"}>
                <StyledInput type={"text"} defaultValue={customDisplay.value}
                             onChange={value => customDisplay.setAndSaveValue(`${value}`)}/>
            </SettingOption>
            <SettingOption title="Custom conversion rate">
                <StyledInput type="number" defaultValue={customConversionRateDisplay.value}
                             onChange={value => customConversionRateDisplay.setAndSaveValue(+value)}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}