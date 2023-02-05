import { useSignal } from '@preact/signals'
import { ISetting } from '../../../infrastructure'
import { Div, TextInput, useTheme, WithActions, WithChildren } from '../../atoms'
import { OptionRow, SettingOption } from '../Shared'
import { DisableCurrenciesCard } from './DisableCurrenciesCard'
import { KeyboardShortcutsCard } from './KeyboardShortcutsCard'
import { MiscCard } from './MiscCard'
import { MouseInteractionCard } from './MouseInteractionCard'
import { SiteAllowanceCard } from './SiteAllowanceCard'
import { StorageManagementCard } from './StorageManagementCard'

export function AccessibilityCard() {
	return (
		<>
			<KeyboardShortcutsCard/>
			<MouseInteractionCard/>
			<MiscCard/>
			<DisableCurrenciesCard/>
			<SiteAllowanceCard/>
			<StorageManagementCard/>
		</>
	)
}

export const AllowanceListContainer = Div

export const DisabledListContainer = ( props: WithChildren ) => <Div { ...props } style={ {
	width: '100%',
	maxHeight: '400px',
	overflowY: 'auto',
	overflowX: 'hidden',
} }/>

export const DisabledListItem = ( props: WithActions ) => {
	const theme = useTheme()
	return <Div { ...props }
	            css={ classname => <style jsx>{ `
                  .${ classname } {
                    width: 99%;
                    margin: auto;
                    text-align: center;
                    border-bottom: solid 1px ${ theme.formBorder };
                    padding-top: 10px;
                    padding-bottom: 10px;
                    background-color: ${ theme.containerBackground };
                  }

                  .${ classname }:hover {
                    background-color: ${ theme.backgroundBorderFocus };
                    border-color: ${ theme.errorBackground };
                    cursor: pointer;
                  }
	            ` }</style> }/>
}

export type ListHandlerProps = {
	whitelistSetting: ISetting<string[]>;
	blacklistSetting: ISetting<string[]>;
};

export function ListHandler( {
	                             whitelistSetting,
	                             blacklistSetting,
                             }: ListHandlerProps ) {
	const whitelist = useSignal( whitelistSetting.value || [] )
	const blacklist = useSignal( blacklistSetting.value || [] )

	async function removeIfExist( text: string, allowed: boolean ) {
		const setting = allowed ? whitelistSetting : blacklistSetting
		const setter = allowed ? whitelist : blacklist
		const list = setting.value.filter( ( e ) => e !== text )
		await setting.setAndSaveValue( list )
		setter.value = setting.value
	}

	async function addNew( text: string, allowed: boolean ) {
		const setting = allowed ? whitelistSetting : blacklistSetting
		const setter = allowed ? whitelist : blacklist
		const list = setting.value.concat( [ text ] )
		await setting.setAndSaveValue( list )
		await removeIfExist( setting.value[setting.value.length - 1], !allowed )
		setter.value = setting.value
	}

	async function removeIfEmpty( text: string, index: number, allowed: boolean ) {
		if ( text ) return
		const setting = allowed ? whitelistSetting : blacklistSetting
		const setter = allowed ? whitelist : blacklist
		const list = setting.value.filter( ( e, j ) => j !== index )
		await setting.setAndSaveValue( list )
		setter.value = setting.value
	}

	async function update( text: string, index: number, allowed: boolean ) {
		const setting = allowed ? whitelistSetting : blacklistSetting
		const setter = allowed ? whitelist : blacklist
		const copy = setting.value
		copy[index] = text

		await setting.setAndSaveValue( copy )
		await removeIfExist( setting.value[index], !allowed )
		setter.value = setting.value
	}

	return (
		<OptionRow>
			<SettingOption title="Blacklist">
				<AllowanceListContainer>
					{ blacklist.value
					           .filter( ( e ) => e )
					           .map( ( e, i ) => {
						           return (
							           <TextInput
								           key={ `list_${ e }` }
								           placeholder={ 'https://...' }
								           value={ e }
								           onInput={ async ( value ) =>
									           removeIfEmpty( `${ value }`, i, false )
								           }
								           onEnter={ async ( value ) => update( `${ value }`, i, false ) }
							           />
						           )
					           } ) }
					<TextInput
						key={ `${ Math.random() }_unique` }
						value=""
						placeholder={ 'https://...' }
						onEnter={ async ( value ) => addNew( `${ value }`, false ) }
					/>
				</AllowanceListContainer>
			</SettingOption>
			<SettingOption title="Whitelist">
				<AllowanceListContainer>
					{ whitelist.value
					           .filter( ( e ) => e )
					           .map( ( e, i ) => {
						           return (
							           <TextInput
								           key={ `list_${ e }` }
								           placeholder={ 'https://...' }
								           value={ e }
								           onInput={ async ( value ) => removeIfEmpty( `${ value }`, i, true ) }
								           onEnter={ async ( value ) => update( `${ value }`, i, true ) }
							           />
						           )
					           } ) }
					<TextInput
						key={ `${ Math.random() }_unique` }
						value=""
						placeholder={ 'https://...' }
						onEnter={ async ( value ) => addNew( `${ value }`, true ) }
					/>
				</AllowanceListContainer>
			</SettingOption>
		</OptionRow>
	)
}