import {useProvider} from '../../../infrastructure';
import {OptionRow, OptionsSection, SettingOption} from '../Shared';
import {Checkbox, Input} from '../../atoms';
import * as React from 'react';
import {ListHandler} from './AccessibilityCard';
import {OptionCardProps} from '../OptionsApp';
import {isFilteredOut} from '../FilterOptionsCard';

export function SiteAllowanceCard(props: OptionCardProps) {
    const {
        blacklistedUrls,
        usingBlacklisting,
        whitelistedUrls,
        usingWhitelisting,
    } = useProvider()

    if (isFilteredOut(['whitelist',  'blacklist', 'allowance', 'site', 'url'], props.filter))
        return <></>

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
        <ListHandler whitelistSetting={whitelistedUrls} blacklistSetting={blacklistedUrls}/>
    </OptionsSection>
}