import * as React from 'react'
import { useProvider } from '../../../di'
import { Checkbox, NumberInput, TextInput } from '../../atoms'
import { useFilter } from '../../molecules/contexts/FilterContext'
import { isFilteredOut } from '../FilterOptionsCard'
import { OptionRow, OptionsSection, SettingOption } from '../Shared'

export function CustomDisplayCard() {
	const { filter } = useFilter()
	const {
		currencyStylingConfig: {
			customDisplay,
			enabled,
			conversionRate,
		},
	} = useProvider()

	if ( isFilteredOut( [ 'display', 'custom' ], filter ) ) return <></>

	return (
		<OptionsSection title="Custom display">
			<OptionRow key="visual_display">
				<SettingOption title="Use custom display">
					<Checkbox
						value={ enabled.value }
						onChange={ ( value ) => enabled.setAndSaveValue( value ) }
					/>
				</SettingOption>
				<SettingOption title="Custom display" help={ '¤ becomes the number' }>
					<TextInput
						defaultValue={ customDisplay.value }
						onChange={ ( value ) => customDisplay.setAndSaveValue( `${ value }` ) }
					/>
				</SettingOption>
				<SettingOption title="Custom conversion rate">
					<NumberInput
						defaultValue={ conversionRate.value }
						onChange={ ( value ) =>
							conversionRate.setAndSaveValue( +value )
						}
					/>
				</SettingOption>
			</OptionRow>
		</OptionsSection>
	)
}
