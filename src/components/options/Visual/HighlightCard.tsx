import * as React from 'react'
import { useState } from 'react'
import { useProvider } from '../../../di'
import { Checkbox, NumberInput, TextInput } from '../../atoms'
import { useFilter } from '../../molecules/contexts/FilterContext'
import { isFilteredOut } from '../FilterOptionsCard'
import { OptionRow, OptionsSection, SettingOption } from '../Shared'

export function HighlightCard() {
	const { filter } = useFilter()
	const {
		highlightConfig: {
			enabled,
			color,
			duration,
		},
	} =
		useProvider()
	const [ stateColor, setColor ] = useState( color.value )

	if ( isFilteredOut( [ 'highlight', 'color', 'duration' ], filter ) ) return <></>

	return (
		<OptionsSection title="Conversion highlight">
			<OptionRow key="visual_highlight">
				<SettingOption title="Highlight conversions">
					<Checkbox
						value={ enabled.value }
						onChange={ ( value ) =>
							enabled.setAndSaveValue( value )
						}
					/>
				</SettingOption>
				<SettingOption
					title="Highlight color"
					help={ 'Allows oth names and HEX' }
				>
					<TextInput
						borderHoverColor={ stateColor }
						defaultValue={ stateColor }
						onChange={ async ( value ) =>
							( await color.setAndSaveValue( `${ value }` ) ) &&
							setColor( color.value )
						}
					/>
				</SettingOption>
				<SettingOption title="Highlight duration" help={ '1000 = 1 second' }>
					<NumberInput
						defaultValue={ duration.value }
						onChange={ ( value ) => duration.setAndSaveValue( +value ) }
					/>
				</SettingOption>
			</OptionRow>
		</OptionsSection>
	)
}
