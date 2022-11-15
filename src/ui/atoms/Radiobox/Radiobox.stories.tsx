import React, { useState } from 'react'
import { Radiobox } from './Radiobox'

export default {
	title: 'Atoms/Input',
	component: Radiobox,
}

export const radioBox = () => {
	const [ state, setState ] = useState( 0 )
	return ( <>
		<Radiobox value={ state === 0 }
		          onClick={ () => setState( 0 ) }
		          onChange={ () => console.log( `Selected 0: ${ state === 0 }` ) }/>
		<Radiobox value={ state === 1 }
		          onClick={ () => setState( 1 ) }
		          onChange={ () => console.log( `Selected 1: ${ state === 1 }` ) }/>
		<Radiobox value={ state === 2 }
		          onClick={ () => setState( 2 ) }
		          onChange={ () => console.log( `Selected 2: ${ state === 2 }` ) }/>
	</> )
}