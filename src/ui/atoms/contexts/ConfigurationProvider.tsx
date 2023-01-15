import React, { PropsWithChildren, useEffect, useState } from 'react'
import { handleError, useProvider } from '../../../di'
import { DropdownOption } from '../../molecules'

type LoadedContext = {
	isLoading: boolean;
	symbols: DropdownOption[];
};

const Context = React.createContext<LoadedContext>( null as unknown as LoadedContext )

type Props = {}

export function ConfigurationProvider( { children }: PropsWithChildren<Props> ) {
	const [ symbols, setSymbols ] = useState<DropdownOption[]>( [] )

	useEffect( () => {
		const { backendApi, config } = useProvider()
		Promise.all( [
			backendApi.symbols(),
			config.load() ] )
		       .then( ( [ symbols ] ) => setSymbols(
			       Object.entries( symbols ).map( ( [ key, value ] ) => ( {
				       text: `${ value } (${ key })`,
				       key: key,
			       } ) ) ) )
		       .catch( handleError )
	}, [] )

	return <Context.Provider value={ { isLoading: !symbols, symbols: symbols ?? [] } }>
		{ children }
	</Context.Provider>
}

export function useConfiguration(): LoadedContext {
	return React.useContext( Context )
}
