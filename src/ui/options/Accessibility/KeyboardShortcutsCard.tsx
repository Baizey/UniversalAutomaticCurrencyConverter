import * as React from 'react'
import { useProvider } from '../../../di'
import { Shortcut, useFilter } from '../../atoms'
import { OptionRow, OptionsSection, SettingOption } from '../Shared'

export function KeyboardShortcutsCard() {
	const { isExcluded } = useFilter()
	const {
		qualityOfLifeConfig: {
			keyPressOnHoverFlipConversion,
			keyPressOnAllFlipConversion,
		},
	} = useProvider()

	if ( isExcluded( [ 'keyboard', 'shortcut', 'hover' ] ) ) return <></>

	return (
		<OptionsSection title="Keyboard shortcuts">
			<OptionRow>
				<SettingOption
					title="Convert-hovered shortcut"
					help={ 'Left-click to clear, then click your desired shortcut key' }
				>
					<Shortcut
						value={ keyPressOnHoverFlipConversion.value }
						onChange={ ( value ) => keyPressOnHoverFlipConversion.setAndSaveValue( value ) }
						onClick={ () => {} }
					/>
				</SettingOption>
				<SettingOption
					title="Convert-all shortcut"
					help={ 'Left-click to clear, then click your desired shortcut key' }
				>
					<Shortcut
						value={ keyPressOnAllFlipConversion.value }
						onChange={ ( value ) => keyPressOnAllFlipConversion.setAndSaveValue( value ) }
						onClick={ () => {} }
					/>
				</SettingOption>
			</OptionRow>
		</OptionsSection>
	)
}
