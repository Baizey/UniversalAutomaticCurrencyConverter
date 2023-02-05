import { useProvider } from '../../../di'
import { Checkbox, useFilter, useSymbols } from '../../atoms'
import { Dropdown } from '../../molecules'
import { OptionRow, OptionsSection, SettingOption } from '../Shared'

export function ConvertToCard() {
	const { isExcluded } = useFilter()
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
						options={ useSymbols() }
						initialValue={ convertTo.value }
						onSelection={ ( value ) => convertTo.setAndSaveValue( value ) }
					/>
				</SettingOption>
			</OptionRow>

			<OptionRow key="brackets_row">
				<SettingOption title="Convert pages automatically on load">
					<Checkbox
						value={ useAutoConvertOnPageLoad.value }
						onInput={ value => useAutoConvertOnPageLoad.setAndSaveValue( value ) }
						onClick={ () => {} }
					/>
				</SettingOption>
			</OptionRow>
		</OptionsSection>
	)
}
