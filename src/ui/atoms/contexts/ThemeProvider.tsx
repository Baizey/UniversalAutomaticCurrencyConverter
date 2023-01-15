import React, { useEffect, useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { useProvider } from '../../../di'
import { mapToTheme, themes } from '../../../infrastructure'
import { useConfiguration } from './ConfigurationProvider'

type ThemeType = keyof typeof themes

type ThemeProviderProps = {
	themeName: ThemeType
	changeTheme: ( theme: ThemeType ) => void
};

const Context = React.createContext<ThemeProviderProps>( null as unknown as ThemeProviderProps )

export function UACCThemeProvider( { children }: React.PropsWithChildren ) {
	const { metaConfig: { colorTheme } } = useProvider()
	const { isLoading } = useConfiguration()
	const [ theme, setTheme ] = useState<ThemeType>( colorTheme.value )

	useEffect( () => setTheme( colorTheme.value ), [ isLoading ] )

	const changeTheme = ( theme: ThemeType ) => setTheme( theme )

	return <Context.Provider value={ { changeTheme, themeName: theme } }>
		<ThemeProvider theme={ mapToTheme( theme ) }>
			{ children }
		</ThemeProvider>
	</Context.Provider>
}

export function useThemeChanger(): ThemeProviderProps {
	return React.useContext( Context )
}
