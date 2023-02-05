import { useSignal } from '@preact/signals'
import { useEffect } from 'preact/compat'
import { useProvider } from '../../../di'
import { Text } from '../../atoms'
import { OptionRow, OptionsSection } from '../shared'

type Version = `${ number }.${ number }.${ number }`
type OldVersion = {
	isMissingOldVersion: boolean,
	version: Version
	hasVersionChange: boolean
}

function isNewerVersion( oldVersion: Version, newVersion: Version ): boolean {
	// Only care about minor and major version as that's the only ones which should introduce/change features, and we don't want to popup with this if there's nothing new for users
	if ( !oldVersion ) return true
	const [ newMajor, newMinor, _newPatch ] = newVersion.split( '.' ).map( ( e ) => +e )
	const [ oldMajor, oldMinor, _oldPatch ] = oldVersion.split( '.' ).map( ( e ) => +e )
	if ( newMajor > oldMajor ) return true
	return newMinor > oldMinor
}

export function NewUpdateCard() {
	const { metaConfig: { lastVersion: lastVersionConfig }, browser } = useProvider()
	const lastVersion = useSignal<OldVersion | undefined>( undefined )
	const newVersion = browser.extensionVersion as Version

	useEffect( () => {
		Promise.all( [ browser.loadSync<string | undefined>( lastVersionConfig.storageKey ),
		               lastVersionConfig.loadSetting() ] )
		       .then( async ( [ lastVersionCache, _couldSetLoadedResult ] ) => {
			       const isMissingOldVersion = !lastVersionCache
			       const version = lastVersionConfig.value as Version
			       const hasVersionChange = isNewerVersion( version, newVersion )
			       lastVersion.value = { isMissingOldVersion, hasVersionChange, version }
			       await lastVersionConfig.setAndSaveValue( browser.extensionVersion )
		       } )
	}, [] )

	const data = lastVersion.value
	if ( !data )
		return <></>
	else if ( data.isMissingOldVersion )
		return <Container title="Introduction"
		                  message="You see this because you're a new user"/>
	else if ( data.hasVersionChange )
		return <Container title="Update"
		                  message={ `You see this because there has been an update (${ data.version } => ${ newVersion })` }/>
	else
		return <></>
}

function Container( { title, message }: { title: string, message: string } ) {
	return (
		<OptionsSection title={ title }>
			<OptionRow>
				<Text>
					Hi, thanks for using Universal Automatic Currency Converter!
				</Text>
			</OptionRow>
			<OptionRow>
				<Text>{ message }</Text>
			</OptionRow>
			<OptionRow>
				<Text>
					It is suggested that you look through the settings and configure it to
					your liking :)
				</Text>
			</OptionRow>
		</OptionsSection>
	)
}