import * as React from 'react'
import { useProvider } from '../../../di'
import { Checkbox, Dropdown } from '../../atoms'
import { useConfiguration } from '../../molecules'
import { useFilter } from '../../molecules/contexts/FilterContext'
import { isFilteredOut } from '../FilterOptionsCard'
import { OptionRow, OptionsSection, SettingOption } from '../Shared'

export function ConvertToCard() {
	const { filter } = useFilter()
	const { symbols } = useConfiguration()
	const {
		currencyTagConfig: { convertTo },
		metaConfig: { useAutoConvertOnPageLoad },
	} = useProvider()

	if ( isFilteredOut( [ 'currency', 'automatically', 'convert' ], filter ) ) {
		return <></>
	}

	return (
		<OptionsSection title="Currency">
			<OptionRow key="convert_to_row">
				<SettingOption key="convert_to_option" title="Convert to">
					<Dropdown
						options={ symbols }
						value={ convertTo.value }
						onChange={ ( value ) => convertTo.setAndSaveValue( value ) }
					/>
				</SettingOption>
			</OptionRow>

			<OptionRow key="brackets_row">
				<SettingOption title="Convert pages automatically on load">
					<Checkbox
						value={ useAutoConvertOnPageLoad.value }
						onChange={ ( value ) =>
							useAutoConvertOnPageLoad.setAndSaveValue( value )
						}
					/>
				</SettingOption>
			</OptionRow>
		</OptionsSection>
	)
}
