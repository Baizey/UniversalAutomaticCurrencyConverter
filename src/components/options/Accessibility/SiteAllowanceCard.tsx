import {useProvider} from '../../../infrastructure';
import {OptionRow, OptionsSection, SettingOption} from '../Shared';
import {Checkbox, StyledInput} from '../../atoms';
import * as React from 'react';
import {ListHandler} from './AccessibilityCard';

export function SiteAllowanceCard() {
    const {
        blacklistedUrls,
        usingBlacklisting,
        whitelistedUrls,
        usingWhitelisting,
    } = useProvider()

    return <OptionsSection title="Site allowance">
        <OptionRow>
            <SettingOption title="Use blacklist">
                <Checkbox value={usingBlacklisting.value}
                          onChange={value => usingBlacklisting.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Use whitelist">
                <Checkbox value={usingWhitelisting.value}
                          onChange={value => usingWhitelisting.setAndSaveValue(value)}/>
            </SettingOption>
        </OptionRow>
        <OptionRow>
            <SettingOption title="Check a url against your allowance settings">
                <StyledInput type={"text"} defaultValue={''}
                             onChange={() => {
                                 // TODO: this
                             }}/>
            </SettingOption>
        </OptionRow>
        <OptionRow>
            <SettingOption title="Blacklist">
                <ListHandler setting={blacklistedUrls}/>
            </SettingOption>
            <SettingOption title="Whitelist">
                <ListHandler setting={whitelistedUrls}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}