import * as React from 'react'
import { useProvider } from '../../../di'
import { Checkbox, NumberInput, TextInput, useFilter } from '../../atoms'
import { OptionRow, OptionsSection, SettingOption } from '../Shared'

export function CustomDisplayCard() {
	const { isExcluded } = useFilter()
	const {
		currencyStylingConfig: {
			customDisplay,
			enabled,
			conversionRate,
		},
	} = useProvider()

	if ( isExcluded( [ 'display', 'custom' ] ) ) return <></>

	return (
		<OptionsSection title="Custom display">
			<OptionRow key="visual_display">
				<SettingOption title="Use custom display">
					<Checkbox
						value={ enabled.value }
						onChange={ value => enabled.setAndSaveValue( value ) }
						onClick={ () => {} }
					/>
				</SettingOption>
				<SettingOption title="Custom display" help={ '¤ becomes the number' }>
					<TextInput
						value={ customDisplay.value }
						onChange={ value => customDisplay.setAndSaveValue( `${ value }` ) }
					/>
				</SettingOption>
				<SettingOption title="Custom conversion rate">
					<NumberInput
						value={ conversionRate.value }
						onChange={ value => conversionRate.setAndSaveValue( +value ) }
					/>
				</SettingOption>
			</OptionRow>
		</OptionsSection>
	)
}
