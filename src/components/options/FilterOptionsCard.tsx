import * as React from 'react'
import { TextInput } from '../atoms'
import { useFilter } from '../molecules/contexts/FilterContext'
import { OptionRow, OptionsSection, SettingOption } from './Shared'

export function isFilteredOut(
	keys: string[],
	filter: string | undefined,
): boolean {
	if ( !filter ) return false
	if ( keys.filter( ( k ) => filter.indexOf( k ) >= 0 ).length > 0 ) return false
	return !(
		filter
			.split( ' ' )
			.filter( ( token ) => keys.filter( ( k ) => k.indexOf( token ) >= 0 ).length > 0 )
			.length > 0
	)
}

export function FilterOptionsCard() {
	const { setFilter } = useFilter()
	return (
		<OptionsSection title="Search for what you need">
			<OptionRow>
				<SettingOption
					title=""
					help="Leave empty and click enter to show all options"
				>
					<TextInput
						defaultValue=""
						placeholder="Filter here..."
						onEnter={ ( value ) => setFilter( value ) }
					/>
				</SettingOption>
			</OptionRow>
		</OptionsSection>
	)
}
