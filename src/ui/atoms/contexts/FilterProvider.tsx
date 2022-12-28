import React from 'react'

type ContextProps = {
	isIncluded: ( keys: string[] ) => boolean;
	filterBy: ( text: string ) => void;
};

const Context = React.createContext<ContextProps>( null as unknown as ContextProps )

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

export function FilterProvider( { children }: React.PropsWithChildren ) {
	const [ filter, setFilter ] = React.useState<string>()
	const isIncluded = ( keys: string[] ) => isFilteredOut( keys, filter )
	const filterBy = ( e: string ) => setFilter( e )
	return <Context.Provider value={ { isIncluded, filterBy } }> { children } </Context.Provider>
}

export function useFilter(): ContextProps {
	return React.useContext( Context )
}
