import { useSignal } from '@preact/signals'
import { createContext } from 'preact'
import {PropsWithChildren, useContext, useEffect} from 'preact/compat'
import { handleError, useProvider } from '../../../di'
import { DropdownOption } from '../../molecules'

type Props = { isLoading: boolean, symbols: DropdownOption[] }

const Context = createContext<Props>( null as any )

export function ConfigurationProvider( { children }: PropsWithChildren ) {
	const symbols = useSignal<DropdownOption[] | undefined>( undefined )

	useEffect( () => {
		const { backendApi, config } = useProvider()
		Promise.all( [ backendApi.symbols(), config.load() ] )
		       .then( ( [ newSymbols ] ) => symbols.value =
			       Object.entries( newSymbols ).map( ( [ key, value ] ) => ( {
				       text: `${ value } (${ key })`,
				       key: key,
			       } ) ) )
		       .catch( handleError )
	}, [] )

	return <Context.Provider value={ {
		isLoading: !symbols.value,
		symbols: symbols.value ?? [],
	} }>
		{ children }
	</Context.Provider>
}

export function useSymbols(): DropdownOption[] {
	return useContext( Context ).symbols
}

export function useIsLoading(): boolean {
	return useContext( Context ).isLoading
}