import React, { useState } from 'react'
import { Radiobox } from './Radiobox'
import { RadioGrid, RadioGridProps } from './RadioGrid'

const args: RadioGridProps = { isColumn: false }

// noinspection JSUnusedGlobalSymbols
export default {
	title: 'Atoms/RadioBox',
	component: Radiobox,
	args: args,
}

// noinspection JSUnusedGlobalSymbols
export const radioBox = ( { isColumn }: RadioGridProps ) => {
	const [ value, setValue ] = useState( 0 )

	return <RadioGrid isColumn={ isColumn }>
		<Radiobox value={ value === 0 } onChange={ () => {} } onClick={ () => setValue( 0 ) }/>
		<Radiobox value={ value === 1 } onChange={ () => {} } onClick={ () => setValue( 1 ) }/>
		<Radiobox value={ value === 2 } onChange={ () => {} } onClick={ () => setValue( 2 ) }/>
		<Radiobox value={ value === 3 } onChange={ () => {} } onClick={ () => setValue( 3 ) }/>
		<Radiobox value={ value === 4 } onChange={ () => {} } onClick={ () => setValue( 4 ) }/>
	</RadioGrid>
}