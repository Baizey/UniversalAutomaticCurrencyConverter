import * as React from 'react'
import { useProvider } from '../../../di'
import { Checkbox, Dropdown } from '../../atoms'
import { useFilter } from '../../molecules/contexts/FilterContext'
import { isFilteredOut } from '../FilterOptionsCard'
import { OptionRow, OptionsSection, SettingOption } from '../Shared'

const dollarOptions = [
	{
		value: 'USD',
		label: 'American',
	},
	{
		value: 'CAD',
		label: 'Canadian',
	},
	{
		value: 'AUD',
		label: 'Australian',
	},
	{
		value: 'MXN',
		label: 'Mexican',
	},
	{
		value: 'NZD',
		label: 'New Zealand',
	},
	{
		value: 'SGP',
		label: 'Singapore',
	},
	{
		value: 'HKD',
		label: 'Hong kong',
	},
	{
		value: 'ARS',
		label: 'Argentine peso',
	},
]

const kroneOptions = [
	{
		value: 'SEK',
		label: 'Swedish',
	},
	{
		value: 'DKK',
		label: 'Danish',
	},
	{
		value: 'NOK',
		label: 'Norwegian',
	},
	{
		value: 'ISK',
		label: 'Icelandic',
	},
	{
		value: 'CZK',
		label: 'Czechia',
	},
]

const yenOptions = [
	{
		value: 'CNY',
		label: 'Chinese',
	},
	{
		value: 'JPY',
		label: 'Japanese',
	},
]

export function LocalizationCard() {
	const { filter } = useFilter()
	const {
		localizationConfig: {
			krone,
			yen,
			dollar,
			usingAlert,
		},
	} = useProvider()

	if ( isFilteredOut( [ 'localization', 'krone', 'dollar', 'yen' ], filter ) ) {
		return <></>
	}

	return (
		<OptionsSection title="Default localization">
			<OptionRow>
				<SettingOption title="Dollar$">
					<Dropdown
						options={ dollarOptions }
						value={ dollar.value }
						onChange={ ( value ) => dollar.setAndSaveValue( value ) }
					/>
				</SettingOption>
				<SettingOption title="Kr.">
					<Dropdown
						options={ kroneOptions }
						value={ krone.value }
						onChange={ ( value ) => krone.setAndSaveValue( value ) }
					/>
				</SettingOption>
				<SettingOption title="¥en">
					<Dropdown
						options={ yenOptions }
						value={ yen.value }
						onChange={ ( value ) => yen.setAndSaveValue( value ) }
					/>
				</SettingOption>
			</OptionRow>

			<OptionRow key="brackets_row">
				<SettingOption title="Show localization alerts">
					<Checkbox
						value={ usingAlert.value }
						onChange={ ( value ) => usingAlert.setAndSaveValue( value ) }
					/>
				</SettingOption>
			</OptionRow>
		</OptionsSection>
	)
}
