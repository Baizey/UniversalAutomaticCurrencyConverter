import * as React from 'react'
import { useProvider } from '../../../infrastructure'
import { LoggingSettingType } from '../../../infrastructure/Configuration/Configuration'
import { Checkbox, Dropdown } from '../../atoms'
import { useFilter } from '../../molecules/contexts/FilterContext'
import { isFilteredOut } from '../FilterOptionsCard'
import { OptionRow, OptionsSection, SettingOption } from '../Shared'

const loggingOptions = [
	{
		value: 'nothing',
		label: 'Nothing',
	},
	{
		value: 'error',
		label: 'Errors',
	},
	{
		value: 'info',
		label: 'Information',
	},
	{
		value: 'debug',
		label: 'Everything',
	},
]

export function MiscCard() {
	const { filter } = useFilter()
	const {
		useLogging,
		showConversionInBrackets,
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
						value={ useLogging.value }
						options={ loggingOptions }
						onChange={ ( value ) =>
							useLogging.setAndSaveValue( value as LoggingSettingType )
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
