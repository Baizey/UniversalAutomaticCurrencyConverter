import { useProvider } from '../../../di'
import { Checkbox, useFilter } from '../../atoms'
import { OptionRow, OptionsSection, SettingOption } from '../shared'
import { ListHandler } from './AccessibilityCard'

export function SiteAllowanceCard() {
	const { isExcluded } = useFilter()
	const {
		siteAllowanceConfig: {
			blacklistedUrls,
			whitelistedUrls,
			useWhitelisting,
			useBlacklisting,
		},
	} = useProvider()

	if ( isExcluded( [ 'whitelist', 'blacklist', 'allowance', 'site', 'url' ] ) ) {
		return <></>
	}

	return (
		<OptionsSection title="Site allowance">
			<OptionRow>
				<SettingOption title="Use blacklist">
					<Checkbox
						value={ useBlacklisting.value }
						onValueChange={ (value ) => useBlacklisting.setAndSaveValue( value ) }
						onClick={ () => {} }
					/>
				</SettingOption>
				<SettingOption title="Use whitelist">
					<Checkbox
						value={ useWhitelisting.value }
						onValueChange={ (value ) => useWhitelisting.setAndSaveValue( value ) }
						onClick={ () => {} }
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
