import {useProvider} from '../../../infrastructure';
import {OptionRow, OptionsSection, SettingOption} from '../Shared';
import {Checkbox} from '../../atoms';
import * as React from 'react';
import {OptionCardProps} from '../OptionsApp';
import {isFilteredOut} from '../FilterOptionsCard';

export function MiscCard(props: OptionCardProps) {
    const {useLogging, showConversionInBrackets} = useProvider()

    if (isFilteredOut(['debug',  'logging', 'brackets', 'misc'], props.filter))
        return <></>

    return <OptionsSection title="Misc">
        <OptionRow>
            <SettingOption title="Show debug logging">
                <Checkbox value={useLogging.value}
                          onChange={value => useLogging.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption key="brackets_option" title="Display conversion in brackets beside original price">
                <Checkbox value={showConversionInBrackets.value}
                          onChange={value => showConversionInBrackets.setAndSaveValue(value)}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}