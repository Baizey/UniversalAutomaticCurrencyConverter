import {useProvider} from '../../../infrastructure';
import {OptionRow, OptionsSection, SettingOption} from '../Shared';
import {Checkbox} from '../../atoms';
import * as React from 'react';

export function MouseInteractionCard() {
    const {usingHoverFlipConversion, usingLeftClickFlipConversion} = useProvider()
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