import { useSignal } from '@preact/signals'
import { createContext } from 'preact'
import {PropsWithChildren, useContext} from 'preact/compat'

type ContextProps = {
	isExcluded: ( keys: string[] ) => boolean;
	filterBy: ( text: string ) => void;
};

const Context = createContext<ContextProps>( null as unknown as ContextProps )

function isFilteredOut( keys: string[], filter?: string ): boolean {
	if ( !filter ) return false
	if ( keys.filter( ( k ) => filter.indexOf( k ) >= 0 ).length > 0 ) return false
	return !(
		filter
			.split( ' ' )
			.filter( ( token ) => keys.filter( ( k ) => k.indexOf( token ) >= 0 ).length > 0 )
			.length > 0
	)
}

export function FilterProvider( { children }: PropsWithChildren ) {
	const filter = useSignal<string>( '' )
	const isExcluded = ( keys: string[] ) => isFilteredOut( keys, filter.value )
	const filterBy = ( e: string ) => filter.value = e

	return <Context.Provider value={ { isExcluded, filterBy } }> { children } </Context.Provider>
}

export function useFilter(): ContextProps {
	return useContext( Context )
}
