import * as React from 'react'
import { useProvider } from '../../../di'
import { Checkbox } from '../../atoms'
import { useFilter } from '../../molecules/contexts/FilterContext'
import { isFilteredOut } from '../FilterOptionsCard'
import { OptionRow, OptionsSection, SettingOption } from '../Shared'

export function MouseInteractionCard() {
	const { filter } = useFilter()
	const {
		qualityOfLifeConfig: {
			leftClickOnHoverFlipConversion,
			onHoverFlipConversion,
		},
	} = useProvider()

	if ( isFilteredOut( [ 'mouse', 'leftclick', 'hover', 'convert' ], filter ) ) {
		return <></>
	}

	return (
		<OptionsSection title="Mouse interactions">
			<OptionRow>
				<SettingOption title="Convert prices by left clicking">
					<Checkbox
						value={ leftClickOnHoverFlipConversion.value }
						onChange={ ( value ) =>
							leftClickOnHoverFlipConversion.setAndSaveValue( value )
						}
					/>
				</SettingOption>
				<SettingOption title="Convert prices on hover over">
					<Checkbox
						value={ onHoverFlipConversion.value }
						onChange={ ( value ) =>
							onHoverFlipConversion.setAndSaveValue( value )
						}
					/>
				</SettingOption>
			</OptionRow>
		</OptionsSection>
	)
}
