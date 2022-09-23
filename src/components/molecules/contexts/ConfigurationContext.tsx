import React, { PropsWithChildren, useEffect, useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { useProvider } from '../../../di'
import { mapToTheme, themes } from '../../../infrastructure'

interface Symbol {
	label: string;
	value: string;
}

type LoadedContext = {
	isLoading: boolean;
	setTheme: ( theme: keyof typeof themes ) => void;
	symbols: Symbol[];
};

type ContextProps =
	| LoadedContext
	| ( Partial<LoadedContext> & { isLoading: boolean } );

const defaultValue: ContextProps = {
	isLoading: true,
}

const SymbolContext = React.createContext<ContextProps>( defaultValue )

export function ConfigurationContext( { children }: PropsWithChildren<{}> ) {
	const { metaConfig: { colorTheme } } = useProvider()
	const [ theme, setTheme ] = useState( colorTheme.value as keyof typeof themes )
	const [ symbols, setSymbols ] = useState<Symbol[] | undefined>()

	useEffect( () => {
		useProvider()
			.config.load()
			.then( async () => {
				const {
					metaConfig: { colorTheme },
					backendApi,
				} = useProvider()
				setTheme( colorTheme.value as keyof typeof themes )
				const result = await backendApi.symbols()
				setSymbols(
					Object.entries( result ).map( ( [ k, v ] ) => ( {
						label: `${ v } (${ k })`,
						value: k,
					} ) ),
				)
			} )
			.catch( ( err ) => {
				const { logger } = useProvider()
				logger.error( err )
			} )
	}, [] )

	return (
		<SymbolContext.Provider
			value={ {
				isLoading: !symbols,
				setTheme: ( theme ) => setTheme( theme ),
				symbols: symbols,
			} }
		>
			<ThemeProvider theme={ mapToTheme( theme ) }>{ children }</ThemeProvider>
		</SymbolContext.Provider>
	)
}

export function useConfiguration(): LoadedContext {
	return React.useContext( SymbolContext ) as LoadedContext
}
