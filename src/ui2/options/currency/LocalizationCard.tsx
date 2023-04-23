import { useProvider } from '../../../di'
import { Checkbox, useFilter } from '../../atoms'
import { Dropdown } from '../../molecules'
import { OptionRow, OptionsSection, SettingOption } from '../shared'

const dollarOptions = [
	{
		key: 'USD',
		text: 'American',
	},
	{
		key: 'CAD',
		text: 'Canadian',
	},
	{
		key: 'AUD',
		text: 'Australian',
	},
	{
		key: 'MXN',
		text: 'Mexican',
	},
	{
		key: 'NZD',
		text: 'New Zealand',
	},
	{
		key: 'SGP',
		text: 'Singapore',
	},
	{
		key: 'HKD',
		text: 'Hong kong',
	},
	{
		key: 'ARS',
		text: 'Argentine peso',
	},
]

const kroneOptions = [
	{
		key: 'SEK',
		text: 'Swedish',
	},
	{
		key: 'DKK',
		text: 'Danish',
	},
	{
		key: 'NOK',
		text: 'Norwegian',
	},
	{
		key: 'ISK',
		text: 'Icelandic',
	},
	{
		key: 'CZK',
		text: 'Czechia',
	},
]

const yenOptions = [
	{
		key: 'CNY',
		text: 'Chinese',
	},
	{
		key: 'JPY',
		text: 'Japanese',
	},
]

export function LocalizationCard() {
	const { isExcluded } = useFilter()
	const {
		localizationConfig: {
			krone,
			yen,
			dollar,
			usingAlert,
		},
	} = useProvider()

	if ( isExcluded( [ 'localization', 'krone', 'dollar', 'yen' ] ) ) {
		return <></>
	}

	return (
		<OptionsSection title="Default localization">
			<OptionRow>
				<SettingOption title="Dollar$">
					<Dropdown
						options={ dollarOptions }
						initialValue={ dollar.value }
						onSelection={ ( value ) => dollar.setAndSaveValue( value ) }
					/>
				</SettingOption>
				<SettingOption title="Kr.">
					<Dropdown
						options={ kroneOptions }
						initialValue={ krone.value }
						onSelection={ ( value ) => krone.setAndSaveValue( value ) }
					/>
				</SettingOption>
				<SettingOption title="¥en">
					<Dropdown
						options={ yenOptions }
						initialValue={ yen.value }
						onSelection={ ( value ) => yen.setAndSaveValue( value ) }
					/>
				</SettingOption>
			</OptionRow>

			<OptionRow key="brackets_row">
				<SettingOption title="Show localization alerts">
					<Checkbox
						value={ usingAlert.value }
						onInput={ ( value ) => usingAlert.setAndSaveValue( value ) }
						onClick={ () => {} }
					/>
				</SettingOption>
			</OptionRow>
		</OptionsSection>
	)
}
