import * as React from 'react'
import { useProvider } from '../../../di'
import { Checkbox, useConfiguration, useFilter } from '../../atoms'
import { Dropdown } from '../../molecules'
import { OptionRow, OptionsSection, SettingOption } from '../Shared'

export function ConvertToCard() {
	const { isExcluded } = useFilter()
	const { symbols } = useConfiguration()
	const {
		currencyTagConfig: { convertTo },
		metaConfig: { useAutoConvertOnPageLoad },
	} = useProvider()

	if ( isExcluded( [ 'currency', 'automatically', 'convert' ] ) ) {
		return <></>
	}

	return (
		<OptionsSection title="Currency">
			<OptionRow key="convert_to_row">
				<SettingOption key="convert_to_option" title="Convert to">
					<Dropdown
						options={ [ ...symbols.entries() ].map( ( [ key, value ] ) => ( {
							key: `${ key }`,
							text: `${ value }`,
						} ) ) }
						initialValue={ convertTo.value }
						onSelection={ ( value ) => convertTo.setAndSaveValue( value ) }
					/>
				</SettingOption>
			</OptionRow>

			<OptionRow key="brackets_row">
				<SettingOption title="Convert pages automatically on load">
					<Checkbox
						value={ useAutoConvertOnPageLoad.value }
						onChange={ value => useAutoConvertOnPageLoad.setAndSaveValue( value ) }
						onClick={ () => {} }
					/>
				</SettingOption>
			</OptionRow>
		</OptionsSection>
	)
}
