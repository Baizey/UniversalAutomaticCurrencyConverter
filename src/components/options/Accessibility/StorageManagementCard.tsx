import * as React from 'react'
import { useEffect, useState } from 'react'
import { useProvider } from '../../../di'
import { BrowserDataStorage } from '../../../infrastructure/Browser/Browser'
import { ErrorButton, PrimaryButton, ReadonlyInput, SecondaryButton } from '../../atoms'
import { useFilter } from '../../molecules/contexts/FilterContext'
import { isFilteredOut } from '../FilterOptionsCard'
import { OptionRow, OptionsSection, SettingOption } from '../Shared'

export function StorageManagementCard(): JSX.Element {
	const { filter } = useFilter()
	const { browser } = useProvider()
	const [ showDone, setShowDone ] = useState( false )
	const [ showConfirm, setShowConfirm ] = useState( false )
	const [ storage, setStorage ] = useState<BrowserDataStorage[]>( [] )

	useEffect( () => {
		browser.allStorage().then( ( e ) => setStorage( e ) )
	}, [] )
	useEffect( () => {
		setStorage( [] )
	}, [ showDone ] )

	if ( isFilteredOut( [ 'storage', 'management' ], filter ) ) return <></>

	function wrap( child: JSX.Element ): JSX.Element {
		return (
			<OptionsSection title="Storage management">
				<OptionRow>{ child }</OptionRow>
				<>
					{ storage
						.map( ( e ) => ( {
							...e,
							value: JSON.stringify( e.value ),
						} ) )
						.map( ( e ) => (
							<OptionRow key={ `${ e.key }` }>
								<SettingOption
									title={ `${ e.key }` }
									help={ `Above setting is using ${ e.type } storage` }
								>
									<ReadonlyInput defaultValue={ `${ e.value }` }/>
								</SettingOption>
							</OptionRow>
						) ) }
				</>
			</OptionsSection>
		)
	}

	if ( showDone ) {
		return wrap(
			<SettingOption
				title=""
				help="You have to refresh the page if you want to do this again"
			>
				<SecondaryButton>All settings cleared</SecondaryButton>
			</SettingOption>,
		)
	}

	if ( showConfirm ) {
		return wrap(
			<SettingOption
				title=""
				help="Clicking this time will delete all extension storage"
			>
				<ErrorButton
					onClick={ async () => {
						browser.clearSettings()
						setShowDone( true )
					} }
				>
					Click to confirm deleting all storage
				</ErrorButton>
			</SettingOption>,
		)
	}

	return wrap(
		<SettingOption title="" help="You have to click again after to confirm">
			<PrimaryButton
				onClick={ () => {
					setShowConfirm( true )
				} }
			>
				Clear all storage
			</PrimaryButton>
		</SettingOption>,
	)
}
