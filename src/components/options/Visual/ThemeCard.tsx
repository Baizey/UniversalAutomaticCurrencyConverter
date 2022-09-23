import * as React from 'react'
import { useProvider } from '../../../di'
import { themes } from '../../../infrastructure'
import { Dropdown } from '../../atoms'
import { useConfiguration } from '../../molecules'
import { useFilter } from '../../molecules/contexts/FilterContext'
import { isFilteredOut } from '../FilterOptionsCard'
import { OptionRow, OptionsSection, SettingOption } from '../Shared'

const themeOptions = Object.entries( themes ).map( ( [ key ] ) => ( {
	value: key,
	label: [ key.replace( /[A-Z]/g, ( e ) => ` ${ e }` ) ].map(
		( e ) => e[0].toUpperCase() + e.substr( 1, e.length ).toLowerCase(),
	)[0],
} ) )

export function ThemeCard() {
	const { filter } = useFilter()
	const { setTheme } = useConfiguration()
	const { metaConfig: { colorTheme } } = useProvider()

	if ( isFilteredOut( [ 'theme', 'color' ], filter ) ) return <></>

	return (
		<OptionsSection title="Theme">
			<OptionRow key="visual_theme">
				<SettingOption title="Color theme">
					<Dropdown
						value={ colorTheme.value as string }
						onChange={ async ( value ) =>
							( await colorTheme.setAndSaveValue(
								value as keyof typeof themes,
							) ) && setTheme( value as keyof typeof themes )
						}
						options={ themeOptions }
					/>
				</SettingOption>
			</OptionRow>
		</OptionsSection>
	)
}
