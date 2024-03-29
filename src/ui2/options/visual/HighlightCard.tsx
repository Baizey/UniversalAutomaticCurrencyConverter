import { useState } from 'preact/compat'
import { useProvider } from '../../../di'
import { Checkbox, NumberInput, TextInput, useFilter } from '../../atoms'
import { OptionRow, OptionsSection, SettingOption } from '../shared'

export function HighlightCard() {
	const { isExcluded } = useFilter()
	const {
		highlightConfig: {
			enabled,
			color,
			duration,
		},
	} =
		useProvider()
	const [ stateColor, setColor ] = useState( color.value )

	if ( isExcluded( [ 'highlight', 'color', 'duration' ] ) ) return <></>

	return (
		<OptionsSection title="Conversion highlight">
			<OptionRow key="visual_highlight">
				<SettingOption title="Highlight conversions">
					<Checkbox
						value={ enabled.value }
						onValueChange={ (value ) => enabled.setAndSaveValue( value ) }
						onClick={ () => {} }
					/>
				</SettingOption>
				<SettingOption
					title="Highlight color"
					help={ 'Allows oth names and HEX' }
				>
					<TextInput
						borderHoverColor={ stateColor }
						value={ stateColor }
						onValueChange={ async ( value ) =>
							( await color.setAndSaveValue( `${ value }` ) ) &&
							setColor( color.value )
						}
					/>
				</SettingOption>
				<SettingOption title="Highlight duration" help={ '1000 = 1 second' }>
					<NumberInput
						value={ duration.value }
						onValueChange={ ( value ) => duration.setAndSaveValue( +value ) }
					/>
				</SettingOption>
			</OptionRow>
		</OptionsSection>
	)
}
