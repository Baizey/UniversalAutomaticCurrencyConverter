import * as React from 'react'
import { useProvider } from '../../../di'
import { Checkbox, useFilter } from '../../atoms'
import { OptionRow, OptionsSection, SettingOption } from '../Shared'

export function MouseInteractionCard() {
	const { isExcluded } = useFilter()
	const {
		qualityOfLifeConfig: {
			leftClickOnHoverFlipConversion,
			onHoverFlipConversion,
		},
	} = useProvider()

	if ( isExcluded( [ 'mouse', 'leftclick', 'hover', 'convert' ] ) ) {
		return <></>
	}

	return (
		<OptionsSection title="Mouse interactions">
			<OptionRow>
				<SettingOption title="Convert prices by left clicking">
					<Checkbox
						value={ leftClickOnHoverFlipConversion.value }
						onChange={ ( value ) => leftClickOnHoverFlipConversion.setAndSaveValue( value ) }
						onClick={ () => {} }
					/>
				</SettingOption>
				<SettingOption title="Convert prices on hover over">
					<Checkbox
						value={ onHoverFlipConversion.value }
						onChange={ ( value ) => onHoverFlipConversion.setAndSaveValue( value ) }
						onClick={ () => {} }
					/>
				</SettingOption>
			</OptionRow>
		</OptionsSection>
	)
}
