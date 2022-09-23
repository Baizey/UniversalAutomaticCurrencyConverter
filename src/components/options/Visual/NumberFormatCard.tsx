import * as React from 'react'
import { useProvider } from '../../../di'
import { Dropdown, NumberInput } from '../../atoms'
import { useFilter } from '../../molecules/contexts/FilterContext'
import { isFilteredOut } from '../FilterOptionsCard'
import { OptionRow, OptionsSection, SettingOption } from '../Shared'

const thousandsOptions = [
	{
		value: ' ',
		label: '100 000 (space)',
	},
	{
		value: ',',
		label: '100,000 (comma)',
	},
	{
		value: '.',
		label: '100.000 (dot)',
	},
	{
		value: '',
		label: '100000 (nothing)',
	},
]

const commaOptions = [
	{
		value: ',',
		label: '0,50 (comma)',
	},
	{
		value: '.',
		label: '0.50 (dot)',
	},
]

export function NumberFormatCard() {
	const { filter } = useFilter()
	const {
		numberStylingConfig: {
			decimal,
			group,
			significantDigits,
		},
	} = useProvider()

	if (
		isFilteredOut(
			[
				'decimal',
				'rounding',
				'thousand',
				'significant',
				'digit',
				'format',
				'number',
			],
			filter,
		)
	) {
		return <></>
	}

	return (
		<OptionsSection title="Number formatting and rounding">
			<OptionRow key="visual_format">
				<SettingOption title="Thousands separator">
					<Dropdown
						options={ thousandsOptions }
						value={ group.value }
						onChange={ ( value ) => group.setAndSaveValue( value ) }
					/>
				</SettingOption>
				<SettingOption title="Decimal point">
					<Dropdown
						options={ commaOptions }
						value={ decimal.value }
						onChange={ ( value ) => decimal.setAndSaveValue( value ) }
					/>
				</SettingOption>
				<SettingOption title="Important digits on rounding">
					<NumberInput
						defaultValue={ significantDigits.value }
						onChange={ ( value ) => significantDigits.setAndSaveValue( +value ) }
					/>
				</SettingOption>
			</OptionRow>
		</OptionsSection>
	)
}
