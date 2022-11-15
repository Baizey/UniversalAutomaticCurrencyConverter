import React from 'react'

type ContextProps = {
	filter: string;
	setFilter: ( text: string ) => void;
};

const Context = React.createContext<ContextProps>( { filter: '', setFilter: () => {} } )

export function FilterContext( { children }: React.PropsWithChildren ) {
	const [ filter, setFilter ] = React.useState<string>( '' )
	return <Context.Provider value={ { filter, setFilter } }> { children } </Context.Provider>
}

export function useFilter(): ContextProps {
	return React.useContext( Context )
}
