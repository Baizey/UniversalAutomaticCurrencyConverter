import { useSignal } from '@preact/signals'
import { useProvider } from '../../../di'
import { useFilter, useSymbols } from '../../atoms'
import { Dropdown } from '../../molecules'
import { OptionRow, OptionsSection, SettingOption } from '../shared'
import { DisabledListContainer, DisabledListItem } from './AccessibilityCard'

export function DisableCurrenciesCard() {
	const { isExcluded } = useFilter()
	const symbols = useSymbols()
	const { currencyTagConfig: { disabled } } = useProvider()
	const listOfDisabledCurrencies = useSignal<string[]>( disabled.value )

	if ( isExcluded( [ 'disabled', 'currencies' ] ) ) return <></>

	return (
		<OptionsSection title="Disable currencies">
			<OptionRow>
				<SettingOption title="Search for currencies to disable">
					<Dropdown
						options={ symbols }
						initialValue={ '' }
						onSelection={ ( value ) => {
							const newList = listOfDisabledCurrencies.value.concat( [ value ] )
							newList.sort()
							if ( disabled.setValue( newList ) ) {
								listOfDisabledCurrencies.value = newList
								disabled.save()
							}
						} }
					/>
				</SettingOption>
			</OptionRow>
			<OptionRow>
				<SettingOption title="Disabled currencies">
					<DisabledListContainer>
						{ listOfDisabledCurrencies.value.map( ( e ) => (
							<DisabledListItem
								key={ `disable_${ e }` }
								onClick={ () => {
									const newList = listOfDisabledCurrencies.value.filter( f => f !== e )
									listOfDisabledCurrencies.value = newList
									disabled.setAndSaveValue( newList )
								} }
							>
								{ e }
							</DisabledListItem>
						) ) }
					</DisabledListContainer>
				</SettingOption>
			</OptionRow>
		</OptionsSection>
	)
}
