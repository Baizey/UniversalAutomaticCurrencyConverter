import * as React from 'react'
import { useProvider } from '../../../di'
import { NumberInput, useFilter } from '../../atoms'
import { Dropdown } from '../../molecules'
import { OptionRow, OptionsSection, SettingOption } from '../Shared'

const thousandsOptions = [
	{
		key: ' ',
		text: '100 000 (space)',
	},
	{
		key: ',',
		text: '100,000 (comma)',
	},
	{
		key: '.',
		text: '100.000 (dot)',
	},
	{
		key: '',
		text: '100000 (nothing)',
	},
]

const commaOptions = [
	{
		key: ',',
		text: '0,50 (comma)',
	},
	{
		key: '.',
		text: '0.50 (dot)',
	},
]

export function NumberFormatCard() {
	const { isExcluded } = useFilter()
	const {
		numberStylingConfig: {
			decimal,
			group,
			significantDigits,
		},
	} = useProvider()

	if (
		isExcluded(
			[
				'decimal',
				'rounding',
				'thousand',
				'significant',
				'digit',
				'format',
				'number',
			],
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
						initialValue={ group.value }
						onSelection={ ( value ) => group.setAndSaveValue( value ) }
					/>
				</SettingOption>
				<SettingOption title="Decimal point">
					<Dropdown
						options={ commaOptions }
						initialValue={ decimal.value }
						onSelection={ ( value ) => decimal.setAndSaveValue( value ) }
					/>
				</SettingOption>
				<SettingOption title="Important digits on rounding">
					<NumberInput
						value={ significantDigits.value }
						onChange={ ( value ) => significantDigits.setAndSaveValue( +value ) }
					/>
				</SettingOption>
			</OptionRow>
		</OptionsSection>
	)
}
