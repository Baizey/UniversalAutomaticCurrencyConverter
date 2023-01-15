import * as React from 'react'
import { useProvider } from '../../../di'
import { themes } from '../../../infrastructure'
import { useFilter, useThemeChanger } from '../../atoms'
import { Dropdown } from '../../molecules'
import { OptionRow, OptionsSection, SettingOption } from '../Shared'

const themeOptions = Object.entries( themes ).map( ( [ key ] ) => ( {
	key: key,
	text: [ key.replace( /[A-Z]/g, ( e ) => ` ${ e }` ) ].map(
		( e ) => e[0].toUpperCase() + e.substr( 1, e.length ).toLowerCase(),
	)[0],
} ) )

export function ThemeCard() {
	const { isExcluded } = useFilter()
	const { changeTheme } = useThemeChanger()
	const { metaConfig: { colorTheme } } = useProvider()

	if ( isExcluded( [ 'theme', 'color' ] ) ) return <></>

	return (
		<OptionsSection title="Theme">
			<OptionRow key="visual_theme">
				<SettingOption title="Color theme">
					<Dropdown
						initialValue={ colorTheme.value as string }
						onSelection={ async ( value ) =>
							( await colorTheme.setAndSaveValue(
								value as keyof typeof themes,
							) ) && changeTheme( value as keyof typeof themes )
						}
						options={ themeOptions }
					/>
				</SettingOption>
			</OptionRow>
		</OptionsSection>
	)
}
