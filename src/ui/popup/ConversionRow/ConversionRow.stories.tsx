import React from 'react'
import { ConversionRow } from './ConversionRow'


export default {
	title: 'Popup/ConversionRow',
	component: ConversionRow,
	args: {},
	argTypes: {},
}

// noinspection JSUnusedGlobalSymbols
export const conversionRow = () => <ConversionRow
	from={ 'USD' } to={ 'EUR' } amount={ 100 }
	onChange={ e => console.log( `Changed: ${ JSON.stringify( e ) }` ) }
	onDelete={ () => console.log( `Deleted` ) }/>
