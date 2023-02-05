import { JSX } from 'preact'
import { useEffect, useState } from 'preact/compat'
import { useProvider } from '../../../di'
import { BrowserDataStorage } from '../../../infrastructure/Browser/Browser'
import { ErrorButton, PrimaryButton, ReadonlyInput, SecondaryButton, useFilter } from '../../atoms'
import { OptionRow, OptionsSection, SettingOption } from '../Shared'

export function StorageManagementCard() {
	const { isExcluded } = useFilter()
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

	if ( isExcluded( [ 'storage', 'management' ] ) ) return <></>

	function wrap( child: JSX.Element ): JSX.Element {
		return (
			<OptionsSection title="Storage management">
				<OptionRow>{ child }</OptionRow>
				<>
					{ storage
						.map( ( e ) => ( {
							...e,
							key: JSON.stringify( e.key ),
						} ) )
						.map( ( e ) => (
							<OptionRow key={ `${ e.key }` }>
								<SettingOption
									title={ `${ e.key }` }
									help={ `Above setting is using ${ e.type } storage` }
								>
									<ReadonlyInput value={ `${ JSON.stringify( e.value ) }` }/>
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
