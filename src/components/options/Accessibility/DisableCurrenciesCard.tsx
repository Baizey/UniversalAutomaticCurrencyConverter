import * as React from 'react'
import { useState } from 'react'
import { useProvider } from '../../../di'
import { Dropdown } from '../../atoms'
import { useConfiguration } from '../../molecules'
import { useFilter } from '../../molecules/contexts/FilterContext'
import { isFilteredOut } from '../FilterOptionsCard'
import { OptionRow, OptionsSection, SettingOption } from '../Shared'
import { DisabledListContainer, DisabledListItem } from './AccessibilityCard'

export function DisableCurrenciesCard() {
	const { filter } = useFilter()
	const { symbols } = useConfiguration()
	const { currencyTagConfig: { disabled } } = useProvider()
	const [ listOfDisabledCurrencies, setListOfDisabledCurrencies ] = useState<string[]>( disabled.value )

	if ( isFilteredOut( [ 'disabled', 'currencies' ], filter ) ) return <></>

	return (
		<OptionsSection title="Disable currencies">
			<OptionRow>
				<SettingOption title="Search for currencies to disable">
					<Dropdown
						options={ symbols }
						onChange={ ( value ) => {
							const newList = listOfDisabledCurrencies.concat( [ value ] )
							newList.sort()
							if ( disabled.setValue( newList ) ) {
								setListOfDisabledCurrencies( newList )
								disabled.save()
							}
						} }
					/>
				</SettingOption>
			</OptionRow>
			<OptionRow>
				<SettingOption title="Disabled currencies">
					<DisabledListContainer>
						{ listOfDisabledCurrencies.map( ( e ) => (
							<DisabledListItem
								key={ `disable_${ e }` }
								onClick={ () => {
									const newList = listOfDisabledCurrencies.filter(
										( f ) => f !== e,
									)
									setListOfDisabledCurrencies( newList )
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
