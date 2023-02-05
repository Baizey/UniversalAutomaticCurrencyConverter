import { useSignal } from '@preact/signals'
import { createContext } from 'preact'
import { useContext, useEffect } from 'preact/compat'
import { useProvider } from '../../../di'
import { mapToTheme, MyTheme, themes } from '../../../infrastructure'
import { WithChildren } from '../core'

type ThemeType = keyof typeof themes

type ThemeProviderProps = {
	themeName: ThemeType
	changeTheme: ( theme: ThemeType ) => void
	theme: MyTheme
};

const Context = createContext<ThemeProviderProps>( null as any )

export function UACCThemeProvider( { children }: WithChildren ) {
	const { metaConfig: { colorTheme } } = useProvider()
	const theme = useSignal<ThemeType>( colorTheme.value )
	useEffect( () => { theme.value = colorTheme.value }, [ colorTheme.value ] )
	const changeTheme = ( t: ThemeType ) => colorTheme.setValue( t )
	return <Context.Provider value={ {
		changeTheme,
		themeName: theme.value,
		theme: mapToTheme( theme.value ),
	} } children={ children }/>
}

export function useTheme(): MyTheme {
	return useContext( Context ).theme
}

export function useChangeTheme( e: ThemeType ) {
	return useContext( Context ).changeTheme( e )
}