import { TextInput, useFilter } from '../../atoms'
import { OptionRow, OptionsSection, SettingOption } from '../shared'

export function FilterOptionsCard() {
	const { filterBy } = useFilter()
	return (
		<OptionsSection title="Search for what you need">
			<OptionRow>
				<SettingOption
					title=""
					help="Leave empty and click enter to show all options"
				>
					<TextInput
						value=""
						placeholder="Filter here..."
						onEnter={ ( value ) => filterBy( value ) }
					/>
				</SettingOption>
			</OptionRow>
		</OptionsSection>
	)
}
