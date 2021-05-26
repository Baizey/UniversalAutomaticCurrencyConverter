import {useProvider} from '../../../infrastructure';
import {OptionRow, OptionsSection, SettingOption} from '../Shared';
import {Checkbox} from '../../atoms';
import * as React from 'react';
import {OptionCardProps} from '../OptionsApp';
import {isFilteredOut} from '../FilterOptionsCard';

export function MouseInteractionCard(props: OptionCardProps) {
    const {usingHoverFlipConversion, usingLeftClickFlipConversion} = useProvider()

    if (isFilteredOut(['mouse',  'leftclick', 'hover', 'convert'], props.filter))
        return <></>

    return <OptionsSection title="Mouse interactions">
        <OptionRow>
            <SettingOption title="Convert prices by left clicking">
                <Checkbox value={usingLeftClickFlipConversion.value}
                          onChange={value => usingLeftClickFlipConversion.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Convert prices on hover over">
                <Checkbox value={usingHoverFlipConversion.value}
                          onChange={value => usingHoverFlipConversion.setAndSaveValue(value)}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}