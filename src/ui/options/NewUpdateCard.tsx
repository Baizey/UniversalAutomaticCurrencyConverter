import * as React from 'react'
import { useEffect, useState } from 'react'
import { useProvider } from '../../di'
import { Text } from '../atoms'
import { OptionRow, OptionsSection } from './Shared'

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
	const [ lastVersion, setLastVersion ] = useState<OldVersion>()
	const newVersion = browser.extensionVersion as Version

	useEffect( () => {
		Promise.all( [ browser.loadSync<string>( lastVersionConfig.storageKey ),
		               lastVersionConfig.loadSetting() ] )
		       .then( async ( [ lastVersionCache, _couldSetLoadedResult ] ) => {
			       const isMissingOldVersion = !lastVersionCache
			       const version = lastVersionConfig.value as Version
			       const hasVersionChange = isNewerVersion( version, newVersion )
			       setLastVersion( { isMissingOldVersion, hasVersionChange, version } satisfies OldVersion )
			       await lastVersionConfig.setAndSaveValue( browser.extensionVersion )
		       } )
	}, [] )

	if ( !lastVersion )
		return <></>
	else if ( lastVersion.isMissingOldVersion )
		return <Container title="Introduction"
		                  message="You see this because you're a new user"/>
	else if ( lastVersion.hasVersionChange )
		return <Container title="Update"
		                  message={ `You see this because there has been an update (${ lastVersion.version } => ${ newVersion })` }/>
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