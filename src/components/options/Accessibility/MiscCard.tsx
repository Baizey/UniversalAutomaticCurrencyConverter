import * as React from 'react'
import { useProvider } from '../../../di'
import { LoggingSettingType } from '../../../infrastructure/Configuration/setting'
import { Checkbox, Dropdown } from '../../atoms'
import { useFilter } from '../../molecules/contexts/FilterContext'
import { isFilteredOut } from '../FilterOptionsCard'
import { OptionRow, OptionsSection, SettingOption } from '../Shared'

const capitalize = ( str: string ) => str.charAt( 0 ).toUpperCase() + str.substring( 1 )

const loggingOptions = [
	{
		value: LoggingSettingType.nothing,
		label: capitalize( LoggingSettingType.nothing ),
	},
	{
		value: LoggingSettingType.error,
		label: capitalize( LoggingSettingType.error ),
	},
	{
		value: LoggingSettingType.info,
		label: capitalize( LoggingSettingType.info ),
	},
	{
		value: LoggingSettingType.debug,
		label: 'Everything',
	},
	{
		value: LoggingSettingType.profile,
		label: 'Everything with profiling',
	},
]

export function MiscCard() {
	const { filter } = useFilter()
	const {
		metaConfig: { logging },
		currencyTagConfig: { showConversionInBrackets },
	} = useProvider()

	if ( isFilteredOut( [ 'debug', 'logging', 'brackets', 'misc' ], filter ) ) {
		return <></>
	}

	return (
		<OptionsSection title="Misc">
			<OptionRow>
				<SettingOption
					title="Allowed logging level"
					help="You can see logs via F12 > Console"
				>
					<Dropdown
						value={ logging.value }
						options={ loggingOptions }
						onChange={ ( value ) =>
							logging.setAndSaveValue( value as LoggingSettingType )
						}
					/>
				</SettingOption>
				<SettingOption
					key="brackets_option"
					title="Display conversion in brackets beside original price"
				>
					<Checkbox
						value={ showConversionInBrackets.value }
						onChange={ ( value ) =>
							showConversionInBrackets.setAndSaveValue( value )
						}
					/>
				</SettingOption>
			</OptionRow>
		</OptionsSection>
	)
}
