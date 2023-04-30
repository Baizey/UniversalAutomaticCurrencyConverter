import { useProvider } from '../../../di'
import { LoggingSettingType } from '../../../infrastructure/Configuration/setting'
import { Checkbox, useFilter } from '../../atoms'
import { Dropdown } from '../../molecules'
import { OptionRow, OptionsSection, SettingOption } from '../shared'

const capitalize = ( str: string ) => str.charAt( 0 ).toUpperCase() + str.substring( 1 )

const loggingOptions = [
	{
		key: LoggingSettingType.nothing,
		text: capitalize( LoggingSettingType.nothing ),
	},
	{
		key: LoggingSettingType.error,
		text: capitalize( LoggingSettingType.error ),
	},
	{
		key: LoggingSettingType.info,
		text: capitalize( LoggingSettingType.info ),
	},
	{
		key: LoggingSettingType.debug,
		text: 'Everything',
	},
	{
		key: LoggingSettingType.profile,
		text: 'Everything with profiling',
	},
]

export function MiscCard() {
	const { isExcluded } = useFilter()
	const {
		metaConfig: { logging },
		currencyTagConfig: { showConversionInBrackets },
	} = useProvider()

	if ( isExcluded( [ 'debug', 'logging', 'brackets', 'misc' ] ) ) {
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
						initialValue={ logging.value }
						options={ loggingOptions }
						onSelection={ ( value ) =>
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
						onValueChange={ (value ) => showConversionInBrackets.setAndSaveValue( value ) }
						onClick={ () => {} }
					/>
				</SettingOption>
			</OptionRow>
		</OptionsSection>
	)
}
