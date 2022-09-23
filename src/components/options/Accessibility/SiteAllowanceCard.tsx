import * as React from 'react'
import { useProvider } from '../../../di'
import { Checkbox } from '../../atoms'
import { useFilter } from '../../molecules/contexts/FilterContext'
import { isFilteredOut } from '../FilterOptionsCard'
import { OptionRow, OptionsSection, SettingOption } from '../Shared'
import { ListHandler } from './AccessibilityCard'

export function SiteAllowanceCard() {
	const { filter } = useFilter()
	const {
		siteAllowanceConfig: {
			blacklistedUrls,
			whitelistedUrls,
			useWhitelisting,
			useBlacklisting,
		},
	} = useProvider()

	if (
		isFilteredOut(
			[ 'whitelist', 'blacklist', 'allowance', 'site', 'url' ],
			filter,
		)
	) {
		return <></>
	}

	return (
		<OptionsSection title="Site allowance">
			<OptionRow>
				<SettingOption title="Use blacklist">
					<Checkbox
						value={ useBlacklisting.value }
						onChange={ ( value ) => useBlacklisting.setAndSaveValue( value ) }
					/>
				</SettingOption>
				<SettingOption title="Use whitelist">
					<Checkbox
						value={ useWhitelisting.value }
						onChange={ ( value ) => useWhitelisting.setAndSaveValue( value ) }
					/>
				</SettingOption>
			</OptionRow>
			<ListHandler
				whitelistSetting={ whitelistedUrls }
				blacklistSetting={ blacklistedUrls }
			/>
		</OptionsSection>
	)
}
