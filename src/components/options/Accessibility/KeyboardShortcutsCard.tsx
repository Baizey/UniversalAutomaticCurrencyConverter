import * as React from 'react'
import { useProvider } from '../../../di'
import { Shortcut } from '../../atoms'
import { useFilter } from '../../molecules/contexts/FilterContext'
import { isFilteredOut } from '../FilterOptionsCard'
import { OptionRow, OptionsSection, SettingOption } from '../Shared'

export function KeyboardShortcutsCard() {
	const { filter } = useFilter()
	const {
		qualityOfLifeConfig: {
			keyPressOnHoverFlipConversion,
			keyPressOnAllFlipConversion,
		},
	} = useProvider()

	if ( isFilteredOut( [ 'keyboard', 'shortcut', 'hover' ], filter ) ) return <></>

	return (
		<OptionsSection title="Keyboard shortcuts">
			<OptionRow>
				<SettingOption
					title="Convert-hovered shortcut"
					help={ 'Left-click to clear, then click your desired shortcut key' }
				>
					<Shortcut
						defaultValue={ keyPressOnHoverFlipConversion.value }
						onChange={ ( value ) => keyPressOnHoverFlipConversion.setAndSaveValue( value ) }
					/>
				</SettingOption>
				<SettingOption
					title="Convert-all shortcut"
					help={ 'Left-click to clear, then click your desired shortcut key' }
				>
					<Shortcut
						defaultValue={ keyPressOnAllFlipConversion.value }
						onChange={ ( value ) => keyPressOnAllFlipConversion.setAndSaveValue( value ) }
					/>
				</SettingOption>
			</OptionRow>
		</OptionsSection>
	)
}
